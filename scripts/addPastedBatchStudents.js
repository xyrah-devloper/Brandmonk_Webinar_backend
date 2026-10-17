const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// Students from the Certificate Generator batch list (UI/UX, Digital Marketing, Video Editing).
// Names already present in a course are skipped, so the script is safe to re-run.
const COURSES = {
  'ui-ux': {
    courseName: 'UI/UX Design',
    certPrefix: 'BMAJUNUIMES/Q0306S',
    students: ['Sarumathi R', 'Sarulatha G', 'Sharmila T', 'Sri Kirubakaran R']
  },
  'digital-marketing': {
    courseName: 'Digital Marketing',
    certPrefix: 'BMAJUNDMMES/Q0506S',
    students: [
      'Dhanusigasree',
      'S.Yuvasankari',
      'C.KAJAYROSAN',
      'Pitchu alias Preethi .G',
      'Dhanush N',
      'Gayathri J',
      'S.SOLOMON'
    ]
  },
  'video-editing': {
    courseName: 'Advanced Video Editing (AI-Integrated)',
    certPrefix: 'BMAJUNVEMES/Q1401S',
    students: ['Anderson W', 'Haridasan G', 'Dhavalashree', 'Meghaa S', 'Krishnaveni. S', 'Praveen Kumar D']
  }
};

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function addStudentsForCourse(courseSlug, config) {
  const { courseName, certPrefix, students } = config;
  console.log(`\n========== ${courseName} (${courseSlug}) ==========`);

  const existingStudents = await CourseStudent.find({ courseSlug });
  const existingCertIds = new Set(existingStudents.map(s => s.certificateId));
  const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));

  let maxNum = 0;
  existingStudents.forEach(s => {
    if (s.certificateId && s.certificateId.startsWith(certPrefix)) {
      const match = s.certificateId.match(/S(\d+)$/);
      if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  });

  let nextNum = maxNum + 1;
  console.log(`Next available ${certPrefix} number: ${String(nextNum).padStart(3, '0')}`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const rawName of students) {
    const name = rawName.trim().replace(/\s+/g, ' ');

    if (existingNames.has(normalizeName(name))) {
      console.log(`⏭️  Skipped (already in ${courseName}): ${name}`);
      skipped++;
      continue;
    }

    const certificateId = `${certPrefix}${String(nextNum).padStart(3, '0')}`;
    if (existingCertIds.has(certificateId)) {
      console.log(`⚠️  Cert ID collision, skipping: ${name} → ${certificateId}`);
      skipped++;
      nextNum++;
      continue;
    }

    try {
      await new CourseStudent({
        name,
        courseName,
        courseSlug,
        certificateId,
        isEligible: true,
        certificateSent: false,
        dateOfRegistration: new Date()
      }).save();

      console.log(`✅ Added: ${name} → ${certificateId}`);
      added++;
      existingNames.add(normalizeName(name));
      existingCertIds.add(certificateId);
      nextNum++;
    } catch (error) {
      if (error.code === 11000) {
        console.log(`⚠️  Skipped (duplicate key): ${name} → ${certificateId}`);
        skipped++;
      } else {
        console.error(`❌ Error adding ${name}: ${error.message}`);
        failed++;
      }
    }
  }

  const finalCount = await CourseStudent.countDocuments({ courseSlug });
  console.log(`Added: ${added} | Skipped: ${skipped} | Failed: ${failed} | Total in ${courseName}: ${finalCount}`);
}

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const [courseSlug, config] of Object.entries(COURSES)) {
      await addStudentsForCourse(courseSlug, config);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

run();
