INSERT INTO department (id, name)
VALUES  (1, "Accounting"),
        (3, "Marketing"),
        (4, "Operations");

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, "Accountant", 80000, 1),
        (2, "Senior Accountant", 110000, 1),
        (3, "Comptroller", 150000, 1),
        (4, "Social Media Specialist", 30000, 2),
        (5, "Content Marketing Manager", 55000, 2),
        (6, "Marketing Director", 90000, 2),
        (7, "Receptionist", 20000, 3),
        (8, "Facilities Manager", 40000, 3),
        (9, "Warehose Manager", 40000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Joe", "Bob", 1, 2),
        (2, "Beth", "Nice", 2, 3),
        (3, "Mary", "Smith", 3, ),
        (4, "Mckinley", "Wiggins", 4, 6),
        (5, "Laney", "May", 4, 6),
        (6, "Danna", "Hardin", 5, 7),
        (7, "Lailah", "Jackson", 6, ),
        (8, "Brennen", "Rosales", 7, 11),
        (9, "Allie", "Hensley", 7, 11),
        (10, "Devin", "Mcneil", 7, 11),
        (11, "Jalen", "Tanner", 8, ),
        (12, "Kolby", "Fitzgerald", 9, );

