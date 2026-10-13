const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const CourseStudent = require('../models/CourseStudent');

// 11 students provided by user
const studentsData = [
  {
    sNo: 1,
    name: 'Sarumathi R',
    courseName: 'UI/UX Design',
    courseSlug: 'ui-ux',
    batch: 'Jul 2025 Batch',
    suggestedCertId: 'BMAJUNUIMES/Q0306S070' // existing
  },
  {
    sNo: 2,
    name: 'Sarulatha G',
    courseName: 'UI/UX Design',
    courseSlug: 'ui-ux',
    batch: 'Jul 2025 Batch',
    suggestedCertId: 'BMAJUNUIMES/Q0306S068' // existing
  },
  {
    sNo: 3,
    name: 'Sharmila T',
    courseName: 'UI/UX Design',
    courseSlug: 'ui-ux',
    batch: 'Jul 2025 Batch',
    suggestedCertId: 'BMAJUNUIMES/Q0306S072' // existing
  },
  {
    sNo: 4,
    name: 'Dhanusigasree',
    courseName: 'Digital Marketing',
    courseSlug: 'digital-marketing',
    batch: 'Jan 2026 Weekend Batch',
    suggestedCertId: 'BMAJUNDMMES/Q0506S182' // existing (Dhanusigasree R)
  },
  {
    sNo: 5,
    name: 'S.Yuvasankari',
    courseName: 'Digital Marketing',
    courseSlug: 'digital-marketing',
    batch: null,
    suggestedCertId: 'BMASEPDMMES/Q0506S053'
  },
  {
    sNo: 6,
    name: 'Anderson',
    courseName: 'Advanced Video Editing (AI-Integrated)',
    courseSlug: 'video-editing',
    batch: null,
    suggestedCertId: 'BMASEPVEMES/Q1401S043'
  },
  {
    sNo: 7,
    name: 'C.KAJAYROSAN',
    courseName: 'Digital Marketing',
    courseSlug: 'digital-marketing',
    batch: 'Mar Batch',
    suggestedCertId: 'BMASEPDMMES/Q0506S054'
  },
  {
    sNo: 8,
    name: 'Haridasan G',
    courseName: 'Advanced Video Editing (AI-Integrated)',
    courseSlug: 'video-editing',
    batch: null,
    suggestedCertId: 'BMASEPVEMES/Q1401S030' // existing (Haridasan. G)
  },
  {
    sNo: 9,
    name: 'Pitchu alias Preethi .G',
    courseName: 'Digital Marketing',
    courseSlug: 'digital-marketing',
    batch: null,
    suggestedCertId: 'BMASEPDMMES/Q0506S055'
  },
  {
    sNo: 10,
    name: 'Dhavalashree',
    courseName: 'Advanced Video Editing (AI-Integrated)',
    courseSlug: 'video-editing',
    batch: 'May 2026',
    suggestedCertId: 'BMASEPVEMES/Q1401S044'
  },
  {
    sNo: 11,
    name: 'Meghaa S',
    courseName: 'Advanced Video Editing (AI-Integrated)',
    courseSlug: 'video-editing',
    batch: 'Jan',
    suggestedCertId: 'BMAJUNDMMES/Q0506S319' // assigned in manual registry
  }
];

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const results = [];

    for (const item of studentsData) {
      console.log(`Processing #${item.sNo}: ${item.name} (${item.courseSlug})...`);

      // 1. Check if student already exists by suggested certificateId
      let student = await CourseStudent.findOne({ certificateId: item.suggestedCertId });

      // 2. If not found by certId, search by normalized name within same course
      if (!student) {
        const norm = normalizeName(item.name);
        const courseStudents = await CourseStudent.find({ courseSlug: item.courseSlug });
        student = courseStudents.find(cs => normalizeName(cs.name) === norm);
      }

      // 3. If still not found and item is Dhanusigasree, check partial match
      if (!student && item.name.includes('Dhanusigasree')) {
        student = await CourseStudent.findOne({ 
          courseSlug: item.courseSlug, 
          name: /Dhanusigasree/i 
        });
      }

      // 4. If still not found and item is Haridasan, check partial match
      if (!student && item.name.includes('Haridasan')) {
        student = await CourseStudent.findOne({ 
          courseSlug: item.courseSlug, 
          name: /Haridasan/i 
        });
      }

      if (student) {
        // Update batch and ensure isEligible
        let updated = false;
        console.log(`  ✓ Found existing record: ${student.name} (${student.certificateId})`);

        if (item.batch && student.batch !== item.batch) {
          console.log(`    Updating batch from "${student.batch}" to "${item.batch}"`);
          student.batch = item.batch;
          updated = true;
        }

        if (!student.isEligible) {
          console.log(`    Updating isEligible to true`);
          student.isEligible = true;
          updated = true;
        }

        if (updated) {
          await student.save();
          console.log(`    ✅ Updated in MongoDB`);
        } else {
          console.log(`    ℹ️ Already up to date`);
        }

        results.push({
          sNo: item.sNo,
          name: student.name,
          courseName: student.courseName,
          courseSlug: student.courseSlug,
          batch: student.batch,
          certificateId: student.certificateId,
          status: updated ? 'UPDATED' : 'ALREADY_EXISTS'
        });

      } else {
        // Create new record
        console.log(`  Creating new record for ${item.name} with Cert ID: ${item.suggestedCertId}...`);

        const newStudent = new CourseStudent({
          name: item.name.trim(),
          courseName: item.courseName,
          courseSlug: item.courseSlug,
          certificateId: item.suggestedCertId,
          batch: item.batch,
          isEligible: true,
          certificateSent: false,
          dateOfRegistration: new Date()
        });

        await newStudent.save();
        console.log(`  ✅ Successfully created new record in MongoDB!`);

        results.push({
          sNo: item.sNo,
          name: newStudent.name,
          courseName: newStudent.courseName,
          courseSlug: newStudent.courseSlug,
          batch: newStudent.batch,
          certificateId: newStudent.certificateId,
          status: 'CREATED'
        });
      }
      console.log('');
    }

    console.log('================================================================================');
    console.log('FINAL VERIFICATION OF ALL 11 STUDENTS IN MONGODB');
    console.log('================================================================================');
    for (const r of results) {
      console.log(`#${r.sNo} | ${r.name.padEnd(25)} | ${r.courseName.padEnd(38)} | ${r.certificateId.padEnd(25)} | Batch: ${(r.batch || '-').padEnd(25)} | [${r.status}]`);
    }
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

run();
