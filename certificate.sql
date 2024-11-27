CREATE TABLE admin (
    id SERIAL PRIMARY KEY,                -- Auto-incrementing primary key
    email VARCHAR(255) UNIQUE NOT NULL,   -- Unique email column
    name VARCHAR(255) NOT NULL,           -- Name of the admin
    address VARCHAR(255),                 -- Optional address field
    created_at TIMESTAMPTZ DEFAULT now(), -- Automatically set timestamp when a row is created
    updated_at TIMESTAMPTZ                -- Timestamp to be updated manually via the application
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,                 -- Auto-incrementing primary key
    student_id VARCHAR(255) UNIQUE NOT NULL, -- Unique student ID
    email VARCHAR(255) UNIQUE NOT NULL,    -- Unique email column
    name VARCHAR(255) NOT NULL,            -- Name of the student
    address VARCHAR(255),                  -- Optional address field
    created_at TIMESTAMPTZ DEFAULT now(),  -- Automatically set timestamp when a row is created
    updated_at TIMESTAMPTZ                -- Timestamp to be updated manually via the application
);

-- Insert into the student table
INSERT INTO student (id, student_id, email, name, address, created_at, updated_at)
VALUES
(1, '20IT911', 'htkhiem.20it9@vku.udn.vn', 'khiêm huỳnh thái', '0x1Be1c0DeAf88B691C5316321E0c713eF1f4CFFeD');

-- Insert into the admin table
INSERT INTO admin (id, email, name, address, created_at, updated_at)
VALUES
(1, 'khiemjoker@gmail.com', 'Department of Student Affairs', '0x0112A16C0F8c66861d37C230A1dbf6C9f60E80D5'),
(2, 'thaikhiem259@gmail.com', 'Academic Affairs Office', '0xa5E80DA6B307e770b036e6bacF5dF8aB3e636eE3');
