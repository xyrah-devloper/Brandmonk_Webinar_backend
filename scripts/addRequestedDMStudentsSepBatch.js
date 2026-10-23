const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Digital Marketing';
const COURSE_SLUG = 'digital-marketing';
const CERTIFICATE_PREFIX = 'BMASEPDMMES/Q0506S';
const RESERVED_SEQUENCE_MAX = 55;
const STUDENTS = ['Divya Bharathi E', 'Velmurugan S', 'Tamilarasan S'];

const normalizeName = (name) => name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

async function addStudents() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingStudents = await CourseStudent.find(
    { courseSlug: COURSE_SLUG },
    { name: 1, certificateId: 1 }
  ).lean();
  const existingNames = new Set(existingStudents.map((student) => normalizeName(student.name)));

  let maxSequence = RESERVED_SEQUENCE_MAX;
  for (const student of existingStudents) {
    if (!student.certificateId?.startsWith(CERTIFICATE_PREFIX)) continue;
    const suffix = student.certificateId.slice(CERTIFICATE_PREFIX.length);
    if (/^\d+$/.test(suffix)) {
      maxSequence = Math.max(maxSequence, Number(suffix));
    }
  }

  let sequence = maxSequence + 1;
  let added = 0;
  let skipped = 0;

  for (const name of STUDENTS) {
    const normalizedName = normalizeName(name);
    if (existingNames.has(normalizedName)) {
      console.log(`Skipped existing DM student: ${name}`);
      skipped++;
      continue;
    }

    let certificateId;
    do {
      certificateId = `${CERTIFICATE_PREFIX}${String(sequence).padStart(3, '0')}`;
      sequence++;
    } while (await CourseStudent.exists({ certificateId }));

    await new CourseStudent({
      name,
      courseName: COURSE_NAME,
      courseSlug: COURSE_SLUG,
      certificateId,
      isEligible: true,
      certificateSent: false,
      dateOfRegistration: new Date()
    }).save();

    existingNames.add(normalizedName);
    console.log(`Added ${name} with certificate ID ${certificateId}`);
    added++;
  }

  console.log(`Complete: ${added} added, ${skipped} already present.`);
}

addStudents()
  .catch((error) => {
    console.error('Failed to add September DM students:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
