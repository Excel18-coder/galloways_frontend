# Admin Quick Reference - Template System

## 🔐 Admin-Only Access Required

All template operations require admin authentication.

---

## 📋 Quick Commands

### List Templates

```bash
GET /resources/templates/list
Authorization: Bearer <your-admin-token>
```

### Download Template

```bash
GET /resources/templates/invoice-fillable.html/download
Authorization: Bearer <your-admin-token>
```

### Update Template

```bash
PUT /resources/templates/letterhead-fillable.html
Authorization: Bearer <your-admin-token>
Content-Type: application/json

{
  "content": "<html>...</html>"
}
```

---

## 🎯 Common Tasks

### Task 1: Create an Invoice

1. Navigate to **Resources → Templates**
2. Click **"Invoice - Fillable"**
3. Fill in client & policy details
4. Add line items
5. Click **"Calculate"** for totals
6. Click **"Print/Save PDF"**
7. Save to client folder

### Task 2: Generate Receipt

1. Open **"Receipt - Fillable"**
2. Enter customer & payment info
3. Enter total amount
4. Click **"Calculate"**
5. Print/Save as PDF
6. Attach to client records

### Task 3: Send Official Letter

1. Open **"Letterhead - Fillable"**
2. Fill recipient details
3. Enter subject & content
4. Add signatory info
5. Print/Save as PDF
6. Email or print for mailing

### Task 4: Edit Template

1. Download template
2. Edit HTML in editor
3. Test locally in browser
4. Use **PUT** endpoint to update
5. Verify changes in dashboard

---

## 🔧 Available Templates

| Template                   | Type     | Use Case                |
| -------------------------- | -------- | ----------------------- |
| `letterhead-fillable.html` | Fillable | Official correspondence |
| `invoice-fillable.html`    | Fillable | Client billing          |
| `receipt-fillable.html`    | Fillable | Payment confirmation    |
| `letterhead.html`          | Static   | Backend integration     |
| `invoice.html`             | Static   | Backend integration     |
| `receipt.html`             | Static   | Backend integration     |

---

## ⚙️ Features

✅ Auto-calculations (invoices/receipts)  
✅ Amount to words conversion  
✅ Print to PDF  
✅ Download for offline use  
✅ Edit & update templates  
✅ Automatic backups on update

---

## 🚨 Troubleshooting

### Issue: Can't access templates

- **Check:** Admin token is valid
- **Check:** Token is included in Authorization header
- **Check:** User role is `admin`

### Issue: Template not updating

- **Check:** Correct template name in URL
- **Check:** Content is valid HTML
- **Check:** Request body format is correct

### Issue: PDF not saving correctly

- **Solution:** Use browser's "Save as PDF" option
- **Solution:** Ensure all fields are filled
- **Solution:** Click "Calculate" before printing

---

## 📱 Dashboard Integration

### Resources Tab → Templates Section

**Actions Available:**

- 📋 **List:** View all templates
- 👁️ **Preview:** Open in new tab
- ⬇️ **Download:** Save locally
- ✏️ **Edit:** Update content
- 📄 **Generate:** Fill & save as PDF

---

## 🔐 Security Notes

- Never share admin tokens
- Logout when done
- Keep template backups
- Review changes before saving
- Monitor template access logs

---

## 📞 Need Help?

**Email:** info@galloways.co.ke  
**Phone:** +254 720 769 993  
**Hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM

---

**Version:** 3.0.0  
**Updated:** December 23, 2025
