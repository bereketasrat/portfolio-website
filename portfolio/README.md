# BEKIDev — Personal Portfolio

Personal portfolio website built with HTML, CSS, JavaScript, PHP, and MySQL.

## Pages
- **Home** — Hero section, previews of about/services/projects
- **About** — Bio, skills, education
- **Services** — What I offer
- **Projects** — Featured work
- **Contact** — Contact form with email notification

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/bereketasrat/portfolio.git
cd portfolio
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Configure credentials
```bash
cp php/config.example.php php/config.php
```
Then open `php/config.php` and fill in your Gmail App Password.

### 4. Set up the database
- Create a MySQL database named `portfolio_db`
- Run `database/schema.sql` via phpMyAdmin or MySQL CLI:
```bash
mysql -u root -p < database/schema.sql
```
- Update `php/db.php` with your database username and password

### 5. Serve with a PHP server
Use WAMP, XAMPP, or any PHP-capable host. Point the document root to this folder.

## Tech Stack
- HTML5, CSS3, JavaScript (vanilla)
- PHP 8+, MySQL
- PHPMailer (via Composer)
- Three.js (CDN)

## Contact
Bereket Asrat — bereketasratt1@gmail.com
