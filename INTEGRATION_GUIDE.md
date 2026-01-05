# Integration Guide for Job Forms and Application Components

## 📋 Job Forms Components

### 1. Routes Added

The following routes have been added to `companies-routing-module.ts`:

- `/companies/job-forms` - List all job forms
- `/companies/job-forms/create` - Create new job form
- `/companies/job-forms/:id/edit` - Edit existing job form

### 2. Navigation

A navigation link has been added to the company sidebar:
- **نماذج التقديم** (Job Forms) - Links to `/companies/job-forms`

### 3. Usage

#### For Companies (Employers):

1. **Access Job Forms List:**
   - Navigate to `/companies/job-forms` or click "نماذج التقديم" in the sidebar
   - View all job forms, search, filter by active status
   - Create, edit, or delete job forms

2. **Create a Job Form:**
   - Click "إنشاء نموذج جديد" button
   - Fill in form name, description, and active status
   - Add questions with different types (text, textarea, select, radio, checkbox, file, date, number)
   - Set question order and required status

3. **Edit a Job Form:**
   - Click the edit icon (✏️) on any job form card
   - Modify form details and questions
   - Reorder questions using up/down arrows

---

## 📝 Application Component (`apply-job`)

### Location
`src/app/pages/jobs/apply-job/`

### Usage Options

#### Option 1: Use in Job Details Page (Recommended)

Replace or enhance the existing application form in `job-details.html`:

```html
<!-- In job-details.html -->
@if (showApplicationForm) {
  <app-apply-job 
    [jobId]="jobDetail.id" 
    [jobTitle]="jobDetail.title">
  </app-apply-job>
}
```

**Don't forget to import the component:**
```typescript
// In job-details.ts
import { ApplyJobComponent } from '@app/pages/jobs/apply-job/apply-job';

@Component({
  imports: [
    // ... existing imports
    ApplyJobComponent,
  ],
})
```

#### Option 2: Use as Standalone Page

Add a route for standalone application:

```typescript
// In your routing module
{
  path: 'jobs/:slug/apply',
  component: ApplyJobComponent,
  data: { breadcrumb: 'التقديم على الوظيفة' }
}
```

Then navigate to it:
```typescript
this.router.navigate(['/jobs', jobSlug, 'apply'], {
  queryParams: { jobId: jobId }
});
```

#### Option 3: Use in Modal/Dialog

```html
<p-dialog [(visible)]="showApplicationDialog" [modal]="true" [style]="{width: '800px'}">
  <app-apply-job 
    [jobId]="selectedJobId" 
    [jobTitle]="selectedJobTitle">
  </app-apply-job>
</p-dialog>
```

### Component Inputs

- `jobId` (required): The ID of the job to apply for
- `jobTitle` (optional): Display the job title in the header

### Features

- ✅ All API fields supported (cover_letter, resume, portfolio_url, etc.)
- ✅ File uploads with validation
- ✅ Dynamic job questions support (if job has a form)
- ✅ Form validation
- ✅ Success/error handling
- ✅ Responsive design

---

## 🔗 Integration with Job Forms

### How Job Forms Work with Applications

1. **Company creates a job form** with custom questions
2. **Company assigns the form to a job** (via job creation/editing)
3. **When applicants apply**, they see:
   - Standard application fields (cover letter, resume, etc.)
   - Custom questions from the job form (if assigned)

### Future Enhancement

To fully integrate job forms with applications, you'll need to:

1. **Add form selection to job creation/editing:**
   ```typescript
   // In job creation form
   jobForm: number | null = null; // ID of the selected job form
   ```

2. **Load job form when applying:**
   ```typescript
   // In apply-job component
   loadJobForm(): void {
     if (this.jobDetail?.job_form_id) {
       this.jobFormService.getJobFormById(this.jobDetail.job_form_id)
         .subscribe(form => {
           this.jobQuestions = form.questions;
         });
     }
   }
   ```

3. **Submit form responses:**
   The `apply-job` component already supports the `responses` array structure needed for job form questions.

---

## 📍 Quick Access

### For Companies:
- **Job Forms List:** `/companies/job-forms`
- **Create Form:** `/companies/job-forms/create`
- **Edit Form:** `/companies/job-forms/{id}/edit`

### For Job Seekers:
- **Apply to Job:** Use `<app-apply-job>` component in job details page
- Or navigate to: `/jobs/{slug}/apply` (if route is added)

---

## 🎨 Styling

All components follow the existing theme:
- Use CSS variables (`var(--primary-color)`, etc.)
- Responsive design
- Consistent with other forms in the application
- Arabic RTL support

---

## ✅ Testing Checklist

- [ ] Navigate to `/companies/job-forms` - should see list
- [ ] Create a new job form
- [ ] Edit an existing job form
- [ ] Delete a job form
- [ ] Apply to a job using the application component
- [ ] Test file uploads
- [ ] Test form validation
- [ ] Test responsive design

