import { Component } from '@angular/core';

type Experience = {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
};

type Education = {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
};

@Component({
  selector: 'app-cv-builder',
  standalone: false,
  templateUrl: './cv-builder.html',
  styleUrls: ['./cv-builder.scss']
})
export class CvBuilder {
  // Basic data model
  model = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    summary: '',
    skills: '' // Comma-separated
  };

  experiences: Experience[] = [];
  educations: Education[] = [];

  //experience section as array
  addExperience() {
    this.experiences.push({ title: '', company: '', start: '', end: '', description: '' });
  }
  removeExperience(i: number) {
    this.experiences.splice(i, 1);
  }

  // education section as array
  addEducation() {
    this.educations.push({ degree: '', institution: '', year: '', grade: '' });
  }
  removeEducation(i: number) {
    this.educations.splice(i, 1);
  }

  // Get skills as array
  get skillsList(): string[] {
    return (this.model.skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Print CV
  printCV() {
    const el = document.getElementById('cvPreview');
    if (!el) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html dir="rtl"><head><title>السيرة الذاتية</title>
      <meta charset="utf-8">
      <style>
        body{font-family: Cairo,Arial,sans-serif; direction: rtl; padding:20px;}
        .cv-header{ text-align:center; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid #3b82f6;}
        .cv-name{ font-size:2rem; font-weight:700; color:#3b82f6; margin-bottom:6px;}
        .cv-title{ color:#6b7280; margin-bottom:12px;}
        .cv-section-title{ color:#3b82f6; font-weight:600; margin:18px 0 10px; padding-bottom:6px; border-bottom:1px solid #d1d5db;}
        .cv-item{ margin-bottom:12px;}
        .skill-tag{ background:#3b82f6; color:#fff; padding:3px 10px; border-radius:16px; margin:0 6px 6px 0; display:inline-block; }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    w.document.close();
    w.print();
  }
}
