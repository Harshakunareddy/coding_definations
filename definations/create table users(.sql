create table users(
    id int primary key,
    user_id int,
    foriegn key(user_id) references users(id)
    on delete cascade
)


insert into users(id,name) values(1,'Harsha');
select * from users;
select name, email from users;

select email, count(*) from users group by email having count(*) > 1;

select users.name, orders.id from users
inner join orders on users.id = orders.user_id;

select users.name, orders.id from users
left join orders on users.id = orders.user_id;

create index idx_name on users(name);

select * from employees 
   where salary > select *, avg(salary) from employees;

select department,count(*) from emp group by department;
select * from emp where name like 'A%';
select *,max(salary) from emp group by dep;
select * from employees where year(created_at) = 2025;

select salary, count(*) from emplpoyess group by salary
    having count(*) > 1;