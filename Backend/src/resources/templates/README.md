# Galloways Insurance - Template Management System

## 🔐 Admin-Only Access

**⚠️ IMPORTANT:** All template endpoints are restricted to admin users only. Authentication and admin role are required for all operations.

---

## 📋 Available Templates

### ✨ Interactive Fillable Templates

Professional templates with form fields that can be filled directly in the browser:

#### 1. **Letterhead** (`letterhead-fillable.html`)

- Date & reference fields
- Recipient information
- Subject & content areas
- Signature section
- Auto-date population

#### 2. **Invoice** (`invoice-fillable.html`)

- Client & policy details
- Dynamic line items (add/remove)
- Auto-calculations:
  - Subtotal
  - Levies (0.25%)
  - Training levy (0.2%)
  - Stamp duty (KES 40)
  - VAT (16%)
- Payment information

#### 3. **Receipt** (`receipt-fillable.html`)

- Customer & payment details
- Policy information
- Amount to words conversion
- Payment breakdown
- Signature & stamp areas
- "PAID" watermark

### 📝 Static Templates

Templates with `{{VARIABLE}}` placeholders for backend integration:

- `letterhead.html`
- `invoice.html`
- `receipt.html`

---

## 🔌 API Endpoints (Admin Only)

### Authentication Required

All endpoints require:

- Valid JWT token in Authorization header
- Admin role (`role: 'admin'`)

### 1. List All Templates

```http
GET /resources/templates/list
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "name": "letterhead-fillable.html",
      "displayName": "letterhead fillable",
      "size": 15234,
      "type": "fillable",
      "category": "letterhead",
      "lastModified": "2025-12-23T10:30:00.000Z"
    }
  ],
  "statusCode": 200
}
```

### 2. View Template

```http
GET /resources/templates/:templateName
Authorization: Bearer <admin-jwt-token>
```

Opens template in browser for viewing/filling.

**Examples:**

- `/resources/templates/invoice-fillable.html`
- `/resources/templates/letterhead-fillable.html`

### 3. Download Template

```http
GET /resources/templates/:templateName/download
Authorization: Bearer <admin-jwt-token>
```

Downloads template file to device.

### 4. Update Template (Edit)

```http
PUT /resources/templates/:templateName
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "content": "<html>...updated template HTML...</html>"
}
```

**Features:**

- Automatic backup created before update
- Backup stored as: `templateName.backup.{timestamp}`
- Validates template exists before updating

**Response:**

```json
{
  "success": true,
  "message": "Template updated successfully",
  "statusCode": 200
}
```

---

## 👨‍💼 Admin Dashboard Integration

### Accessing Templates in Admin Dashboard

#### 1. Navigate to Resources Tab

```
Admin Dashboard → Resources → Templates
```

#### 2. Available Actions

- **View List:** See all available templates
- **Preview:** Open template in new tab
- **Download:** Download for offline editing
- **Edit:** Update template content inline
- **Fill & Generate:** Fill template and save as PDF

### Frontend Implementation Example

```javascript
// Get admin token from auth context
const adminToken = localStorage.getItem('admin_token');

// Fetch templates list
async function fetchTemplates() {
  try {
    const response = await fetch('/api/resources/templates/list', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.data; // Array of templates
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
    // Show error to admin
  }
}

// Open template in new window
function openTemplate(templateName) {
  const url = `/api/resources/templates/${templateName}`;

  // Open with auth token in header (requires fetch + blob URL)
  fetch(url, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    });
}

// Download template
async function downloadTemplate(templateName) {
  try {
    const response = await fetch(
      `/api/resources/templates/${templateName}/download`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// Update template
async function updateTemplate(templateName, newContent) {
  try {
    const response = await fetch(`/api/resources/templates/${templateName}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newContent }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Template updated successfully!');
      return true;
    } else {
      alert('Update failed: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Error updating template:', error);
    return false;
  }
}
```

---

## 📝 Workflow for Admins

### Creating Documents from Templates

#### Method 1: Fill & Save in Browser

1. Open template from dashboard
2. Fill in all required fields
3. Click "Calculate" (for invoices/receipts)
4. Click "Print/Save PDF"
5. Choose "Save as PDF" in print dialog
6. Send to client or save to records

#### Method 2: Download & Edit Locally

1. Download template from dashboard
2. Open in HTML editor or browser
3. Fill or customize
4. Save as PDF
5. Distribute to clients

#### Method 3: Edit Template Source

1. Download template
2. Edit HTML/CSS in code editor
3. Test changes locally
4. Upload updated version via dashboard
5. All future uses will reflect changes

### Template Customization

Admins can customize templates to:

- Update company information
- Change styling/colors
- Add/remove fields
- Modify calculations
- Update terms & conditions

**⚠️ Backup Reminder:** System automatically creates backups, but maintain your own copies of important customizations.

---

## 🎨 Template Features

### All Templates Include:

✅ Galloways branding & logo  
✅ Complete contact information  
✅ Professional color scheme  
✅ Business hours & licensing info  
✅ Print-optimized layout  
✅ Mobile-responsive design

### Brand Colors:

- **Primary Blue:** `#1e3a8a` / `#2563eb`
- **Accent Gold:** `#fbbf24` / `#f59e0b`
- **Success Green:** `#10b981`
- **Text:** `#333333`

---

## 🔒 Security Features

✅ **Authentication Required:** JWT token validation  
✅ **Role-Based Access:** Admin role only  
✅ **Path Validation:** Prevents directory traversal  
✅ **Automatic Backups:** Before every update  
✅ **Audit Trail:** Track template modifications

### Error Handling

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "statusCode": 403
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Template 'filename.html' not found",
  "statusCode": 404
}
```

---

## 💡 Best Practices

### For Template Management:

1. **Test Changes:** Always preview before distributing
2. **Keep Backups:** Download originals before editing
3. **Document Changes:** Note customizations made
4. **Version Control:** Use systematic naming for backups
5. **Review Regularly:** Update templates as business changes

### For Document Generation:

1. **Double-Check Data:** Verify all information before saving
2. **Use Calculations:** Click "Calculate" for invoices/receipts
3. **PDF Quality:** Use browser's "Save as PDF" feature
4. **File Naming:** Use descriptive names (e.g., `Invoice_2025_001_ClientName.pdf`)
5. **Storage:** Organize PDFs by type, date, and client

### For Security:

1. **Protect Tokens:** Never share admin tokens
2. **Regular Logout:** Close sessions when done
3. **Monitor Access:** Review who accesses templates
4. **Audit Updates:** Track template modifications
5. **Backup Important:** Keep copies of critical customizations

---

## 🏢 Company Information

**Company Name:** Galloways Insurance Agencies & Consultancy Services

**Tagline:** "Protecting Dreams and Preserving Wealth"

**Contact Details:**

- **Phone:** +254 720 769 993 / +254 758 301 346
- **Email:** info@galloways.co.ke
- **Underwriting:** underwriting@galloways.co.ke
- **Quotations:** quotations@galloways.co.ke
- **Customer Service:** customerservice@galloways.co.ke
- **Claims:** Claims@galloways.co.ke
- **Location:** Nairobi, Kenya

**Business Hours:**

- Monday - Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 2:00 PM
- Sunday: Closed

**Regulatory:** Licensed by Insurance Regulatory Authority (IRA) Kenya

---

## 📞 Admin Support

For technical issues, questions, or assistance:

- **Email:** info@galloways.co.ke
- **Phone:** +254 720 769 993
- **Admin Helpdesk:** Available during business hours

---

## 📊 Template Statistics

Track template usage in admin dashboard:

- Most downloaded templates
- Template last modified dates
- Backup history
- Usage frequency

---

**Last Updated:** December 23, 2025  
**Version:** 3.0.0 (Admin-Only Access)  
**Access Level:** 🔐 Admin Only
