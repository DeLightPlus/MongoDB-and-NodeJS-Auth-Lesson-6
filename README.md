# MongoDB-and-NodeJS-Auth-Lesson-6

### Objectives
- Add Authentication and Authorization to the Recipe App.
- Authentication:
Choose Between the two
	Token-based authentication:
- Issue a JSON Web Token to authenticated users.
- Store the JWT in a secure location (e.g local storage in the browser).
- Validate the JWT on subsequent requests to verify the user’s identity.
- Session-based authentication:
    * Create a session for the user when they log in.
    * Store a session ID in a cookie or local storage.
    * Use the session ID to retrieve the user’s information from the server.
- Authorization:
- Role-based access control (RBAC):
	* Assign roles to users (e.g admin, users).
        - Define permissions for each role (e.g create recipes, edit recipes).
        - Check the user’s role and permissions before allowing them to perform actions.