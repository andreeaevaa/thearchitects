Zachary Murphy Design Pattern Implementations

For the object oriented design patter, I chose Strategy. This encapsulates the health score
algorithm in a separate class and allows the system to use it without changing the rest of the application. In this project, this is kept in scoreUtils.js. 
It is completetely separate from the rest of the backend logic. 

For the UI design pattern, I chose Cards & Product Page. These implementations are found in searchProduct.jsx, and productPage.jsx, respectively. 


Andreea Apostolescu Design Pattern Implementations 

For the behavioral design pattern, I chose observer. This uses the system's event-listening logic in a separate `Subject` class, allowing the server to react to 
product scans without modifying the core API routes.
Implementation: Located in `server/observer.js`. 
Decoupling: The product routes simply "notify" the observer, keeping the backend logic completely separate from the logging and analytics systems.

For the UI pattern, I implemented input feedback. This creates a reactive interface where the system provides immediate visual interpretation of data.
Implementation: Located in `client/src/pages/productPage.jsx`.
Visual logic: The UI dynamically changes its color scheme (Red/Yellow/Green) based on the health score, providing a quick interpretation of the product's nutritional value.

setup:
1. **Backend:** `cd server && node server.js`
2. **Frontend:** `cd client && npm run dev`


Isabelle Toni Design Pattern Implementations

For the object oriented design Pattern I chose Factory Method. In this project,
the Factory Method is used to generate product objects based on incoming data, keeping object creation flexible and scalable.
Implementation: Located in server/utils/productFactory.js.

For the UI design method I chose , Infinite Scroll. This pattern enhances user experience by dynamically loading additional products as the user scrolls,
rather than requiring pagination or manual input.
Implementation: Located in client/src/pages/searchProduct.jsx.


James Jacobs Design Pattern Implementations

For the objected oriented design pattern, I chose Singleton.
A Singleton makes sure that only one instance of a class is ever created while the application is live.
I applied this design pattern directly to the MongoDB database connection
Implementation: Located in server/utils/singletonDatabase.js as well as small code tweak in server/server.js

For the UI design pattern, I implemented a Password Strength Meter (I had to change from my intial choice, as we changed some workings of our project)
This simply adds as it says, a password strength meter underneath the sign up field to help better protect the user from potential hacks
Implementation: Located in client/src/pages/Register.jsx

