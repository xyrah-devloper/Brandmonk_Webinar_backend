const express = require('express');
const router = express.Router();
const CourseStudent = require('../models/CourseStudent');
const CertificateService = require('../services/certificateService');

const FIXED_CERTIFICATE_ISSUE_DATE = new Date('2026-01-12T00:00:00.000Z');

const MANUAL_CERTIFICATE_REGISTRY = {
  'BMAJUNDMMES/Q0506S021': { name: 'Amuthamalar.R', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S054': { name: 'Ashiquah S', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S063': { name: 'Yuvarani.P', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S064': { name: 'A. Sherwin rose', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S065': { name: 'T. Pandurangan', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S066': { name: 'Lavanya N', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S067': { name: 'N BALAMURUGAN', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S068': { name: 'Kavinsanjay M V', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S069': { name: 'Antony Xavier Prasath R', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S070': { name: 'M Saranraj', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S071': { name: 'Praveen Kumar P', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S072': { name: 'Yuvarekha A', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S073': { name: 'Jabez Sahaya Selvan', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S074': { name: 'G.tharun', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S075': { name: 'Anbarasy J', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S076': { name: 'HariPriya P', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S077': { name: 'Shanmugam P', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S078': { name: 'Premalatha D', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S079': { name: 'Suganya C', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S080': { name: 'S. Anitha Preethi', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S081': { name: 'Hari pradheesh', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNVEMES/Q1401S013': { name: 'S.MUTHUKUMAR', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S014': { name: 'SURESH P', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S015': { name: 'Karthick E', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S016': { name: 'K Sowmiya', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S017': { name: 'Lokesh S', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S018': { name: 'Shalini.K', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S024': { name: 'Deenadhayalan K', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNDMMES/Q0506S092': { name: 'Jeya shree', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S093': { name: 'SAI ANAND.P', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S094': { name: 'Preethishankar', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S095': { name: 'Hariharan Sathianathan', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S096': { name: 'Rajasri', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S097': { name: 'S. Deepa', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S098': { name: 'Nisha S', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S099': { name: 'sureka', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S100': { name: 'Thulasi dass. B', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNVEMES/Q1401S027': { name: 'POUL BLESSON . A', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNVEMES/Q1401S028': { name: 'M.Sham Kumar', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNDMMES/Q0506S305': { name: 'Radhamani S', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S306': { name: 'Rekha', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  // Latest batch - Digital Marketing
  'BMAJUNDMMES/Q0506S307': { name: 'Ammar Ahamad H', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S308': { name: 'Abinaya B', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S309': { name: 'GURU MOORTHY E', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S310': { name: 'Naveen Kumar S V', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S311': { name: 'Sneha S', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S312': { name: 'Devaraj', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S313': { name: 'Akilan', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S314': { name: 'Suriya', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S315': { name: 'Sri Anu Priyanka', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S316': { name: 'F. Aashefa', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S317': { name: 'P.Saravanakumar', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMAJUNDMMES/Q0506S321': { name: 'Kishore Marimuthu', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  // Latest batch - Video Editing
  'BMAJUNDMMES/Q0506S318': { name: 'Shangavi S M', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNDMMES/Q0506S319': { name: 'Meghaa S', courseName: 'Video Editing', courseSlug: 'video-editing' },
  'BMAJUNDMMES/Q0506S320': { name: 'Sabari A', courseName: 'Video Editing', courseSlug: 'video-editing' },
  // Additional batch students
  'BMASEPDMMES/Q0506S053': { name: 'S.Yuvasankari', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMASEPVEMES/Q1401S043': { name: 'Anderson', courseName: 'Advanced Video Editing (AI-Integrated)', courseSlug: 'video-editing' },
  'BMASEPDMMES/Q0506S054': { name: 'C.KAJAYROSAN', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMASEPDMMES/Q0506S055': { name: 'Pitchu alias Preethi .G', courseName: 'Digital Marketing', courseSlug: 'digital-marketing' },
  'BMASEPVEMES/Q1401S044': { name: 'Dhavalashree', courseName: 'Advanced Video Editing (AI-Integrated)', courseSlug: 'video-editing' }
};

// Batch certificate prefixes per course. The first prefix is the default for new batches.
const COURSE_BATCHES = {
  'digital-marketing': {
    courseName: 'Digital Marketing',
    prefixes: ['BMAJUNDMMES/Q0506S', 'BMASEPDMMES/Q0506S']
  },
  'video-editing': {
    courseName: 'Advanced Video Editing (AI-Integrated)',
    prefixes: ['BMAJUNVEMES/Q1401S', 'BMASEPVEMES/Q1401S']
  },
  'ui-ux': {
    courseName: 'UI/UX Design',
    prefixes: ['BMAJUNUIMES/Q0306S']
  },
  'data-analytics': {
    courseName: 'Data Analytics',
    prefixes: ['BMAJUNDAMES/Q0906S']
  },
  'artificial-intelligence': {
    courseName: 'Artificial Intelligence',
    prefixes: ['BMAJUNAIMES/Q0806S']
  }
};

const normalizeStudentName = (name) =>
  name.trim().toUpperCase().replace(/\s+/g, ' ').replace(/\./g, '').replace(/,/g, '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Next free number for a prefix. Counts the database and the hardcoded registry,
// so a new ID never reuses a number that a manual certificate already holds.
const nextCertificateNumber = async (prefix) => {
  const existing = await CourseStudent.find(
    { certificateId: { $regex: `^${escapeRegex(prefix)}` } },
    { certificateId: 1 }
  ).lean();

  const ids = [...existing.map(s => s.certificateId), ...Object.keys(MANUAL_CERTIFICATE_REGISTRY)];
  let max = 0;
  ids.forEach(id => {
    const match = typeof id === 'string' && id.match(new RegExp(`^${escapeRegex(prefix)}(\\d+)$`));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return max + 1;
};

const findCourseStudentForCertificate = async (rawId, decodedId) => {
  // Some filenames/URLs use underscores instead of slashes (e.g. BMAJUNDMMES_Q0506S306)
  const normalizedRawId = rawId ? rawId.replace(/_/g, '/') : rawId;
  const normalizedDecodedId = decodedId ? decodedId.replace(/_/g, '/') : decodedId;

  let student = await CourseStudent.findOne({ certificateId: normalizedDecodedId });

  if (!student && normalizedDecodedId !== normalizedRawId) {
    student = await CourseStudent.findOne({ certificateId: normalizedRawId });
  }

  if (!student && decodedId && decodedId.match(/^[0-9a-fA-F]{24}$/)) {
    student = await CourseStudent.findById(decodedId);
  }

  if (!student && rawId && rawId.match(/^[0-9a-fA-F]{24}$/)) {
    student = await CourseStudent.findById(rawId);
  }

  const manualStudent = MANUAL_CERTIFICATE_REGISTRY[normalizedDecodedId] || MANUAL_CERTIFICATE_REGISTRY[normalizedRawId];

  if (!student && !manualStudent) {
    return null;
  }

  const responseStudent = student
    ? {
        _id: student._id,
        name: student.name,
        courseName: student.courseName,
        courseSlug: student.courseSlug,
        certificateId: student.certificateId,
        isEligible: student.isEligible,
        dateOfRegistration: student.dateOfRegistration || student.createdAt
      }
    : {
        _id: `manual-${(decodedId || rawId).replace(/[^a-zA-Z0-9]/g, '')}`,
        name: manualStudent.name,
        courseName: manualStudent.courseName,
        courseSlug: manualStudent.courseSlug,
        certificateId: decodedId || rawId,
        isEligible: true,
        dateOfRegistration: FIXED_CERTIFICATE_ISSUE_DATE
      };

  if (MANUAL_CERTIFICATE_REGISTRY[responseStudent.certificateId]) {
    responseStudent.dateOfRegistration = FIXED_CERTIFICATE_ISSUE_DATE;
  }

  return responseStudent;
};

// @desc    Bulk generate certificates for students
// @route   POST /api/course-students/bulk/generate
// @access  Private (Admin only)
router.post('/bulk/generate', async (req, res) => {
  const { students } = req.body;

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Students array is required and must not be empty'
    });
  }

  try {
    const results = await CertificateService.bulkCreateCourseStudents(students);

    res.json({
      success: true,
      message: `Processed ${results.totalProcessed} students`,
      results: {
        created: results.success.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
        details: {
          success: results.success,
          skipped: results.skipped,
          failed: results.failed
        }
      }
    });
  } catch (error) {
    console.error("BulkGenerateCertificates Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk certificate generation'
    });
  }
});

// @desc    Get certificate verification data
// @route   GET /api/course-students/verify/:certificateId
// @access  Public (for QR code verification)
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const rawId = req.params.certificateId;
    const decodedId = decodeURIComponent(rawId);
    let verificationData = await CertificateService.getVerificationData(decodedId);

    if (!verificationData && decodedId !== rawId) {
      verificationData = await CertificateService.getVerificationData(rawId);
    }

    if (!verificationData) {
      const manualStudent = MANUAL_CERTIFICATE_REGISTRY[decodedId] || MANUAL_CERTIFICATE_REGISTRY[rawId];
      if (manualStudent) {
        verificationData = {
          _id: `manual-${(decodedId || rawId).replace(/[^a-zA-Z0-9]/g, '')}`,
          name: manualStudent.name,
          courseName: manualStudent.courseName,
          courseSlug: manualStudent.courseSlug,
          certificateId: decodedId || rawId,
          isEligible: true,
          dateOfRegistration: FIXED_CERTIFICATE_ISSUE_DATE,
          batch: null,
          email: null,
          certificateSent: true,
          certificateSentAt: FIXED_CERTIFICATE_ISSUE_DATE
        };
      }
    }

    if (verificationData) {
      res.json({
        success: true,
        certificate: verificationData,
        verifiedAt: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
  } catch (error) {
    console.error("VerifyCertificate Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error verifying certificate'
    });
  }
});

// @desc    Get all course students
// @route   GET /api/course-students
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const students = await CourseStudent.find({}).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: students.length,
      students: students.map(s => ({
        _id: s._id.toString(),
        name: s.name,
        courseName: s.courseName,
        courseSlug: s.courseSlug,
        certificateId: s.certificateId,
        isEligible: s.isEligible,
        certificateSent: s.certificateSent,
        dateOfRegistration: s.dateOfRegistration,
        createdAt: s.createdAt
      }))
    });
  } catch (error) {
    console.error("GetCourseStudents Error:", error);
    res.status(200).json({ 
      success: false, 
      message: 'Failed to fetch course students',
      students: []
    });
  }
});

// @desc    Get course students by course slug
// @route   GET /api/course-students/course/:slug
// @access  Private (Admin only)
router.get('/course/:slug', async (req, res) => {
  try {
    const students = await CourseStudent.find({ courseSlug: req.params.slug }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: students.length,
      students: students.map(s => ({
        _id: s._id.toString(),
        name: s.name,
        courseName: s.courseName,
        courseSlug: s.courseSlug,
        certificateId: s.certificateId,
        isEligible: s.isEligible,
        certificateSent: s.certificateSent,
        addedManually: s.addedManually,
        dateOfRegistration: s.dateOfRegistration,
        createdAt: s.createdAt
      }))
    });
  } catch (error) {
    console.error("GetCourseStudentsByCourse Error:", error);
    res.status(200).json({ 
      success: false, 
      message: 'Failed to fetch course students',
      students: []
    });
  }
});

// @desc    List course batch options (courses, certificate prefixes, manual student counts)
// @route   GET /api/course-students/batch-options
// @access  Private (Admin only)
// Declared before /:id so "batch-options" is not treated as a student ID
router.get('/batch-options', async (req, res) => {
  try {
    const courses = await Promise.all(
      Object.entries(COURSE_BATCHES).map(async ([slug, config]) => ({
        slug,
        courseName: config.courseName,
        prefixes: config.prefixes,
        manualCount: await CourseStudent.countDocuments({ courseSlug: slug, addedManually: true })
      }))
    );

    res.json({ success: true, courses });
  } catch (error) {
    console.error("GetBatchOptions Error:", error);
    res.status(500).json({ success: false, message: 'Failed to load batch options' });
  }
});

// @desc    Get single course student by ID
// @route   GET /api/course-students/:id
// @access  Public (for QR verification)
router.get('/:id', async (req, res) => {
  try {
    // Decode the ID - the frontend double-encodes to preserve slashes,
    // so we must decode once here to get the actual certificate ID
    const rawId = req.params.id;
    const decodedId = decodeURIComponent(rawId);
    const responseStudent = await findCourseStudentForCertificate(rawId, decodedId);

    if (responseStudent) {

      res.json({
        success: true,
        student: responseStudent
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Certificate not found.' 
      });
    }
  } catch (error) {
    console.error("GetCourseStudentById Error:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

// @desc    Get single course student by split certificate ID
// @route   GET /api/course-students/:idPrefix/:idSuffix
// @access  Public (for QR verification)
router.get('/:idPrefix/:idSuffix', async (req, res) => {
  try {
    const rawId = `${req.params.idPrefix}/${req.params.idSuffix}`;
    const decodedId = decodeURIComponent(rawId);
    const responseStudent = await findCourseStudentForCertificate(rawId, decodedId);

    if (responseStudent) {
      res.json({
        success: true,
        student: responseStudent
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Certificate not found.'
      });
    }
  } catch (error) {
    console.error('GetCourseStudentBySplitId Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Add a student to a course batch with the next certificate ID for that batch
// @route   POST /api/course-students
// @access  Private (Admin only)
// Body: { name, courseSlug, certificatePrefix, email?, phoneNumber? }
router.post('/', async (req, res) => {
  const { name, courseSlug, certificatePrefix, email, phoneNumber } = req.body;

  if (!name || !courseSlug || !certificatePrefix) {
    return res.status(400).json({
      success: false,
      message: 'Name, courseSlug and certificatePrefix are required'
    });
  }

  const config = COURSE_BATCHES[courseSlug];
  if (!config) {
    return res.status(400).json({ success: false, message: 'Unknown course' });
  }

  if (!config.prefixes.includes(certificatePrefix)) {
    return res.status(400).json({
      success: false,
      message: `Batch prefix must be one of: ${config.prefixes.join(', ')}`
    });
  }

  const cleanName = name.trim().replace(/\s+/g, ' ');

  try {
    const sameCourse = await CourseStudent.find({ courseSlug }, { name: 1 }).lean();
    const normalized = normalizeStudentName(cleanName);
    if (sameCourse.some(s => normalizeStudentName(s.name) === normalized)) {
      return res.status(409).json({
        success: false,
        message: `${cleanName} is already in ${config.courseName}`
      });
    }

    let number = await nextCertificateNumber(certificatePrefix);

    // Retry with the next number if another request took it first
    for (let attempt = 0; attempt < 5; attempt++, number++) {
      const certificateId = `${certificatePrefix}${number.toString().padStart(3, '0')}`;
      if (MANUAL_CERTIFICATE_REGISTRY[certificateId]) continue;
      if (await CourseStudent.exists({ certificateId })) continue;

      try {
        const savedStudent = await new CourseStudent({
          name: cleanName,
          courseName: config.courseName,
          courseSlug,
          certificateId,
          email: email ? email.trim() : null,
          phoneNumber: phoneNumber ? phoneNumber.trim() : null,
          isEligible: true,
          certificateSent: false,
          addedManually: true,
          dateOfRegistration: new Date()
        }).save();

        return res.status(201).json({
          success: true,
          message: `Added ${cleanName} with certificate ID ${certificateId}`,
          student: savedStudent
        });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }

    res.status(409).json({ success: false, message: 'Could not reserve a certificate ID, please retry' });
  } catch (error) {
    console.error("CreateCourseStudent Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to add course student'
    });
  }
});

// @desc    Delete a course student
// @route   DELETE /api/course-students/:id
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const result = await CourseStudent.findByIdAndDelete(req.params.id);

    if (result) {
      res.json({
        success: true,
        message: 'Course student deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Course student not found'
      });
    }
  } catch (error) {
    console.error("DeleteCourseStudent Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course student'
    });
  }
});

// @desc    Update certificate eligibility
// @route   PATCH /api/course-students/eligibility/:certificateId
// @access  Private (Admin only)
router.patch('/eligibility/:certificateId', async (req, res) => {
  const { isEligible } = req.body;

  if (typeof isEligible !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'isEligible must be a boolean'
    });
  }

  try {
    const updated = await CertificateService.updateEligibility(
      req.params.certificateId,
      isEligible
    );

    if (updated) {
      res.json({
        success: true,
        message: 'Certificate eligibility updated',
        student: updated
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
  } catch (error) {
    console.error("UpdateEligibility Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update eligibility'
    });
  }
});

// @desc    Mark certificate as sent
// @route   PATCH /api/course-students/mark-sent/:certificateId
// @access  Private (Admin only)
router.patch('/mark-sent/:certificateId', async (req, res) => {
  try {
    const updated = await CertificateService.markCertificateAsSent(
      req.params.certificateId
    );

    if (updated) {
      res.json({
        success: true,
        message: 'Certificate marked as sent',
        student: updated
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
  } catch (error) {
    console.error("MarkCertificateAsSent Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark certificate as sent'
    });
  }
});

module.exports = router;
