CREATE DATABASE CHITIEU
GO
USE CHITIEU
GO

/* ============================================================================
   EXPENSES DB – SQL Server
   DDL trước, DML (dữ liệu mẫu) ở cuối – 3 ví dụ mỗi bảng
   ============================================================================ */

SET NOCOUNT ON;

--------------------------------------------------------------------------------
-- (1) DROP TABLES (nếu đã tồn tại) – theo thứ tự phụ thuộc (child -> parent)
--------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.[transactions]', N'U') IS NOT NULL DROP TABLE dbo.[transactions];
IF OBJECT_ID(N'dbo.[savings]', N'U')      IS NOT NULL DROP TABLE dbo.[savings];
IF OBJECT_ID(N'dbo.[loans_debts]', N'U')  IS NOT NULL DROP TABLE dbo.[loans_debts];
IF OBJECT_ID(N'dbo.[budgets]', N'U')      IS NOT NULL DROP TABLE dbo.[budgets];
IF OBJECT_ID(N'dbo.[categories]', N'U')   IS NOT NULL DROP TABLE dbo.[categories];
IF OBJECT_ID(N'dbo.[users]', N'U')        IS NOT NULL DROP TABLE dbo.[users];

--------------------------------------------------------------------------------
-- (2) DDL – TẠO BẢNG (cha trước, con sau)
--------------------------------------------------------------------------------

/* 2.1 USERS: tài khoản người dùng ứng dụng */
CREATE TABLE dbo.[users](
  [id]        INT IDENTITY(1,1) PRIMARY KEY,
  [name]      NVARCHAR(100) NOT NULL,
  [email]     NVARCHAR(255) NOT NULL,
  [password]  NVARCHAR(255) NOT NULL, -- hash hoặc placeholder
  [created_at] DATETIME2(0) NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME()
);
CREATE UNIQUE INDEX UX_users_email ON dbo.[users]([email]);

/* 2.2 CATEGORIES: danh mục chi tiêu/thu nhập */
CREATE TABLE dbo.[categories](
  [id]   INT IDENTITY(1,1) PRIMARY KEY,
  [name] NVARCHAR(100) NOT NULL
);
CREATE UNIQUE INDEX UX_categories_name ON dbo.[categories]([name]);

/* 2.3 BUDGETS: ngân sách theo tháng cho từng user */
CREATE TABLE dbo.[budgets](
  [id]       INT IDENTITY(1,1) PRIMARY KEY,
  [user_id]  INT NOT NULL,
  [month]    CHAR(7) NOT NULL,          -- 'YYYY-MM'
  [amount]   DECIMAL(18,2) NOT NULL,    -- số tiền đặt ngân sách
  [used]     DECIMAL(18,2) NOT NULL CONSTRAINT DF_budgets_used DEFAULT (0),
  CONSTRAINT FK_budgets_users
    FOREIGN KEY([user_id]) REFERENCES dbo.[users]([id])
      ON DELETE NO ACTION ON UPDATE NO ACTION
);

/* 2.4 LOANS_DEBTS: vay/nợ giữa user và người khác */
CREATE TABLE dbo.[loans_debts](
  [id]       INT IDENTITY(1,1) PRIMARY KEY,
  [user_id]  INT NOT NULL,
  [amount]   DECIMAL(18,2) NOT NULL,
  [person]   NVARCHAR(100) NOT NULL,   -- tên người liên quan
  [due_date] DATE NOT NULL,
  [type]     NVARCHAR(10) NOT NULL,    -- 'loan' (cho vay) | 'debt' (mình nợ)
  [status]   NVARCHAR(10) NOT NULL CONSTRAINT DF_loans_debts_status DEFAULT ('pending'), -- 'pending' | 'paid'
  CONSTRAINT CK_loans_debts_type   CHECK ([type] IN (N'loan', N'debt')),
  CONSTRAINT CK_loans_debts_status CHECK ([status] IN (N'pending', N'paid')),
  CONSTRAINT FK_loans_debts_users
    FOREIGN KEY([user_id]) REFERENCES dbo.[users]([id])
      ON DELETE NO ACTION ON UPDATE NO ACTION
);

/* 2.5 SAVINGS: mục tiêu tiết kiệm của user */
CREATE TABLE dbo.[savings](
  [id]             INT IDENTITY(1,1) PRIMARY KEY,
  [user_id]        INT NOT NULL,
  [goal_name]      NVARCHAR(100) NOT NULL,
  [target_amount]  DECIMAL(18,2) NOT NULL,
  [current_amount] DECIMAL(18,2) NOT NULL CONSTRAINT DF_savings_current_amount DEFAULT (0),
  CONSTRAINT FK_savings_users
    FOREIGN KEY([user_id]) REFERENCES dbo.[users]([id])
      ON DELETE NO ACTION ON UPDATE NO ACTION
);

/* 2.6 TRANSACTIONS: phát sinh thu/chi của user */
CREATE TABLE dbo.[transactions](
  [id]            INT IDENTITY(1,1) PRIMARY KEY,
  [user_id]       INT NOT NULL,
  [amount]        DECIMAL(18,2) NOT NULL,
  [date]          DATETIME2(0) NOT NULL,
  [category_id]   INT NOT NULL,
  [note]          NVARCHAR(255) NULL,
  [type]          NVARCHAR(10) NOT NULL,   -- 'income' | 'outcome'
  CONSTRAINT CK_transactions_type CHECK ([type] IN (N'income', N'outcome')),
  CONSTRAINT FK_transactions_users
    FOREIGN KEY([user_id]) REFERENCES dbo.[users]([id]),
  CONSTRAINT FK_transactions_categories
    FOREIGN KEY([category_id]) REFERENCES dbo.[categories]([id])
);

--------------------------------------------------------------------------------
-- (3) DML – DỮ LIỆU MẪU (3 dòng mỗi bảng) – đủ để bạn test Python ngay
-- LƯU Ý: thứ tự insert để không vi phạm FK
--------------------------------------------------------------------------------

/* 3.1 USERS (3 mẫu) */
SET IDENTITY_INSERT dbo.[users] ON;
INSERT INTO dbo.[users]([id],[name],[email],[password])
VALUES (1, N'Admin', N'Admin@example.com', N'$2b$12$hash_demo_An'),
       (2, N'Tam',   N'Tam@example.com', N'$2b$12$hash_demo_Binh'),
       (3, N'Thanh',  N'Thanh@example.com', N'$2b$12$hash_demo_Chi'),
	   (4, N'Hai',  N'Hai@example.com', N'$2b$12$hash_demo_Chi'),
       (5, N'Nam',  N'Nam@example.com', N'$2b$12$hash_demo_Chi'),
	   (6, N'Dang',  N'Dang@example.com', N'$2b$12$hash_demo_Chi');
SET IDENTITY_INSERT dbo.[users] OFF;

/* 3.2 CATEGORIES (18 mẫu) */
SET IDENTITY_INSERT dbo.[categories] ON;
INSERT INTO dbo.[categories] ([id], [name]) VALUES
  (1, N'Uncategorized'),
  (2, N'Food & Drinks'),
  (3, N'Transportation'),
  (4, N'Housing'),
  (5, N'Bills'),
  (6, N'Travel'),
  (7, N'Health'),
  (8, N'Education'),
  (9, N'Shopping'),
  (10, N'Pets'),
  (11, N'Sports'),
  (12, N'Entertainment'),
  (13, N'Investment'),
  (14, N'Family'),
  (15, N'Salary'),
  (16, N'Bonus'),
  (17, N'Business'),
  (18, N'Gifts');
SET IDENTITY_INSERT dbo.[categories] OFF;

/* 3.3 BUDGETS (7 mẫu) */
SET IDENTITY_INSERT dbo.[budgets] ON;
INSERT INTO dbo.[budgets] ([id], [user_id], [month], [amount], [used]) VALUES
  (1, 3, N'2025-06', 30000000.0, 0.0),
  (2, 5, N'2025-06', 9000000.0, 0.0),
  (3, 5, N'2025-07', 10000000.0, 0.0),
  (4, 5, N'2025-07', 5000000.0, 0.0),
  (5, 1, N'2025-06', 700000000.0, 0.0),
  (6, 1, N'2025-07', 500000.0, 0.0),
  (7, 1, N'2025-07', 59999999.0, 0.0);
SET IDENTITY_INSERT dbo.[budgets] OFF;


/* 3.4 LOANS_DEBTS (11 mẫu) */
SET IDENTITY_INSERT dbo.[loans_debts] ON;
INSERT INTO dbo.[loans_debts] ([id], [user_id], [amount], [person], [due_date], [type], [status]) VALUES
  (1, 3, 45000000.0, N'Long', N'2026-01-17', N'debt', N'paid'),
  (2, 3, 30000000.0, N'Đạt', N'2026-06-25', N'debt', N'paid'),
  (3, 3, 3000000.0, N'Tấn', N'2025-06-28', N'loan', N'paid'),
  (4, 3, 30000000.0, N'Long', N'2026-10-23', N'debt', N'paid'),
  (5, 5, 2500000.0, N'Minh', N'2025-06-20', N'loan', N'paid'),
  (6, 5, 200000.0, N'Thành', N'2025-06-20', N'debt', N'paid'),
  (7, 6, 5000000.0, N'Đăng', N'2025-06-21', N'debt', N'paid'),
  (8, 5, 5000000.0, N'Trân', N'2025-06-23', N'debt', N'paid'),
  (9, 5, 3000000.0, N'Hoàng', N'2025-06-30', N'loan', N'pending'),
  (10, 1, 1000000.0, N'John Doe', N'2024-12-31', N'loan', N'pending'),
  (11, 1, 1000000.0, N'Steph Curry', N'2024-12-31', N'loan', N'pending');
SET IDENTITY_INSERT dbo.[loans_debts] OFF;

/* 3.5 SAVINGS (26 mẫu) */
SET IDENTITY_INSERT dbo.[savings] ON;
INSERT INTO dbo.[savings] ([id], [user_id], [goal_name], [target_amount], [current_amount]) VALUES
  (1, 1, N'Mua xe', 40000000.0, 0.0),
  (2, 1, N'Mua nhà', 30000000.0, 0.0),
  (3, 1, N'Mua iphone', 30000000.0, 0.0),
  (4, 1, N'Đám cưới', 30000000.0, 0.0),
  (5, 1, N'Du học', 30000000.0, 0.0),
  (6, 2, N'Tiền học', 30000000.0, 0.0),
  (7, 2, N'Thi Ielts', 20000000.0, 0.0),
  (8, 2, N'Mua iphone', 50000000.0, 0.0),
  (9, 2, N'Mua xe', 50000000.0, 0.0),
  (10, 3, N'Mua xe', 50000000.0, 0.0),
  (11, 3, N'Mua xe', 50000000.0, 0.0),
  (12, 3, N'Du học', 50000000.0, 0.0),
  (13, 3, N'Mua macbook', 50000000.0, 0.0),
  (14, 4, N'Du lịch', 50000000.0, 0.0),
  (15, 4, N'Du lịch', 50000000.0, 0.0),
  (16, 4, N'Tiền nhà', 50000000.0, 0.0),
  (17, 4, N'Mua vàng', 50000000.0, 0.0),
  (18, 5, N'Mua vàng', 30000000.0, 0.0),
  (19, 5, N'Mua nhà', 30000000.0, 0.0),
  (20, 5, N'Tiền học', 30000000.0, 0.0),
  (21, 5, N'Du học', 32000000.0, 0.0),
  (22, 6, N'Mua iphone', 30000000.0, 0.0),
  (23, 6, N'Du lịch', 30900000.0, 0.0),
  (24, 6, N'mua Macbook', 43500000.0, 4500000.0),
  (25, 6, N'Đóng tiền học lại', 7000000.0, 7000000.0),
  (26, 6, N'Mua xe', 10000000.0, 0.0);
SET IDENTITY_INSERT dbo.[savings] OFF;

/* 3.6 TRANSACTIONS (3 mẫu) */
SET IDENTITY_INSERT dbo.[transactions] ON;
INSERT INTO dbo.[transactions]([id],[user_id],[amount],[date],[category_id],[note],[type])
VALUES 
  (1, 1, 50000.0, N'2024-01-15', 1, N'Grocery shopping', N'outcome'),
  (2, 1, 1000000.0, N'2024-01-01', 1, N'Salary', N'income'),
  (3, 1, 30000.0, N'2024-01-10', 1, N'Coffee', N'outcome'),
  (4, 1, 50000.0, N'2024-01-15', 1, N'Grocery shopping', N'outcome'),
  (5, 2, 1000000.0, N'2024-01-01', 1, N'Salary', N'income'),
  (6, 2, 30000.0, N'2024-01-10', 1, N'Coffee', N'outcome'),
  (7, 2, 6000000.0, N'2025-06-17', 15, N'mới lãnh lương', N'income'),
  (8, 2, 30000.0, N'2025-06-17', 2, N'bánh trắng', N'outcome'),
  (9, 3, 30000.0, N'2025-06-17', 2, N'bánh tiêu', N'outcome'),
  (10, 3, 20000.0, N'2025-06-17', 15, N'được mẹ cho', N'income'),
  (11, 3, 5000000.0, N'2025-06-17', 2, N'Mua đồ ăn', N'outcome'),
  (12, 3, 300000.0, N'2025-06-17', 2, N'Ăn nhà hàng', N'outcome'),
  (13, 3, 22222.0, N'2025-06-18', 2, N'Mua nước', N'outcome'),
  (14, 4, 10000000.0, N'2025-06-05', 15, N'lương', N'income'),
  (15, 4, 5000000.0, N'2025-06-10', 8, N'học AIO', N'outcome'),
  (16, 4, 500000.0, N'2025-06-15', 2, N'ăn dokki', N'outcome'),
  (17, 4, 15000000.0, N'2025-05-15', 15, N'lương', N'income'),
  (18, 5, 12000000.0, N'2025-05-16', 1, N'mất tiền', N'outcome'),
  (19, 5, 3000000.0, N'2025-06-12', 2, N'mẹ cho', N'outcome'),
  (20, 5, 500000.0, N'2025-06-18', 16, N'mẹ cho', N'income'),
  (21, 5, 60000.0, N'2025-06-20', 2, N'ăn cơm', N'outcome'),
  (22, 6, 200000.0, N'2025-06-19', 3, N'vé metro', N'outcome'),
  (23, 6, 50000.0, N'2025-06-19', 2, N'đi chơi', N'outcome'),
  (24, 6, 19999999.0, N'2025-06-20', 15, N'Tiền thưởng', N'income'),
  (25, 6, 20000000.0, N'2025-06-20', 2, N'het tien', N'outcome'),
  (26, 6, 500000.0, N'2025-06-20', 18, N'mẹ cho', N'income'),
  (27, 6, 5000000.0, N'2025-07-20', 2, N'bị cướp', N'outcome');
SET IDENTITY_INSERT dbo.[transactions] OFF;
