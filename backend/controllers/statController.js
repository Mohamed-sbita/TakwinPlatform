const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const User = require('../models/user');
const Classe = require('../models/class');
const Department = require('../models/depatment');
const Attendance = require('../models/attendance');
const Groupe = require('../models/groupe');
const Session = require('../models/session');

// Common function to get formateur's groups
const getFormateurGroups = async (formateurId) => {
  return await Session.aggregate([
    { $match: { formateur: new ObjectId(formateurId) } },
    { $group: { _id: '$groupe' } }
  ]);
};

// Common function to get formateur's students
const getFormateurStudents = async (formateurId) => {
  const groups = await getFormateurGroups(formateurId);
  const groupIds = groups.map(g => g._id);
  
  return await User.find({
    role: 'stagiaire',
    idGroupe: { $in: groupIds }
  });
};

// Helper function to count upcoming sessions
const getUpcomingSessionsCount = async (formateurId = null) => {
  const query = { date: { $gte: new Date() } };
  if (formateurId) {
    query.formateur = new ObjectId(formateurId);
  }
  return await Session.countDocuments(query);
};

// Admin Stats Functions
exports.getAdminSummaryStats = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalClasses, totalGroups,totalDepartments] = await Promise.all([
      User.countDocuments({ role: 'stagiaire' }),
      User.countDocuments({ role: 'formateur' }),
      Classe.countDocuments(),
      Groupe.countDocuments(),
      Department.countDocuments()
    ]);

    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      }
    ]);

    const attendanceRate = attendanceStats.length > 0 
      ? (attendanceStats[0].present / attendanceStats[0].total * 100).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalGroups,
      totalDepartments,
      attendanceRate: parseFloat(attendanceRate),
      upcomingSessions: await getUpcomingSessionsCount()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getStudentDistribution = async (req, res) => {
  try {
    const distribution = await User.aggregate([
      { $match: { role: 'stagiaire', idClasse: { $exists: true } } },
      { $group: { _id: '$idClasse', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);

    const classIds = distribution.map(item => item._id);
    const classes = await Classe.find({ _id: { $in: classIds } });

    res.json({
      labels: distribution.map(item => {
        const cls = classes.find(c => c._id.equals(item._id));
        return cls ? cls.nom : 'Unknown Class';
      }),
      values: distribution.map(item => item.count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDepartmentDistribution = async (req, res) => {
  try {
    const distribution = await Classe.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'idClasse',
          as: 'students'
        }
      },
      {
        $project: {
          idDepartment: 1,
          studentCount: { $size: '$students' }
        }
      },
      {
        $group: {
          _id: '$idDepartment',
          count: { $sum: '$studentCount' }
        }
      }
    ]);

    const deptIds = distribution.map(item => item._id);
    const departments = await Department.find({ _id: { $in: deptIds } });

    res.json({
      labels: distribution.map(item => {
        const dept = departments.find(d => d._id.equals(item._id));
        return dept ? dept.nom : 'Unknown Department';
      }),
      values: distribution.map(item => item.count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAttendanceTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trendData = await Attendance.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    res.json({
      labels: trendData.map(item => monthNames[item._id.month - 1]),
      values: trendData.map(item => 
        item.total > 0 ? Math.round((item.present / item.total) * 100) : 0
      )
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Formateur Stats Functions
exports.getFormateurSummaryStats = async (req, res) => {
  try {
    const formateurId = req.user.id;
    if (!ObjectId.isValid(formateurId)) {
      return res.status(400).json({ message: 'Invalid formateur ID' });
    }

    const students = await getFormateurStudents(formateurId);
    const sessions = await Session.countDocuments({ formateur: new ObjectId(formateurId) });
    
    const attendanceStats = await Attendance.aggregate([
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'sessionData'
        }
      },
      { $unwind: '$sessionData' },
      { $match: { 'sessionData.formateur': new ObjectId(formateurId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      }
    ]);

    const attendanceRate = attendanceStats.length > 0 
      ? (attendanceStats[0].present / attendanceStats[0].total * 100).toFixed(1)
      : 0;

    res.json({
      totalStudents: students.length,
      totalSessions: sessions,
      attendanceRate: parseFloat(attendanceRate),
      upcomingSessions: await getUpcomingSessionsCount(formateurId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getFormateurStudentDistribution = async (req, res) => {
  try {
    const formateurId = req.user.id;
    if (!ObjectId.isValid(formateurId)) {
      return res.status(400).json({ message: 'Invalid formateur ID' });
    }

    const students = await getFormateurStudents(formateurId);
    
    const distribution = await User.aggregate([
      { $match: { 
        _id: { $in: students.map(s => new ObjectId(s._id)) },
        idClasse: { $exists: true } 
      }},
      { $group: { _id: '$idClasse', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);

    const classIds = distribution.map(item => new ObjectId(item._id));
    const classes = await Classe.find({ _id: { $in: classIds } });

    res.json({
      labels: distribution.map(item => {
        const cls = classes.find(c => c._id.equals(item._id));
        return cls ? cls.nom : 'Unknown Class';
      }),
      values: distribution.map(item => item.count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getFormateurAttendanceTrend = async (req, res) => {
  try {
    const formateurId = req.user.id;
    if (!ObjectId.isValid(formateurId)) {
      return res.status(400).json({ message: 'Invalid formateur ID' });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trendData = await Attendance.aggregate([
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'sessionData'
        }
      },
      { $unwind: '$sessionData' },
      { $match: { 
        'sessionData.formateur': new ObjectId(formateurId),
        createdAt: { $gte: sixMonthsAgo }
      }},
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    res.json({
      labels: trendData.map(item => monthNames[item._id.month - 1]),
      values: trendData.map(item => 
        item.total > 0 ? Math.round((item.present / item.total) * 100) : 0
      )
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};