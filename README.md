# Project + Lab2 (part)

## Backend for VDo App (Task Management app)

### Design Patters used:
- ***Strategy*** (Implementation of different todos sorting/filtering classes(by name, by date etc.))
- ***Builder*** (Builder classes for different DTOs (todos, activities etc.))
- ***Chain of Responsibility*** (Middleware functions, e.g. verifyJWT)
- ***Bridge*** (Todos Sorting (contains)-> Todos Filtering (Bridge pattern is not really needed here, better to leave both as example of Strategy pattern))