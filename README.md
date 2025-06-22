# Atlan-frontend-challenge
The application is deployed at - https://atlan-frontend-challenge.vercel.app/

Walkthrough of the application - 
Video Link - https://drive.google.com/file/d/19Qf0r37AUlQpWZRL8YxigTW3F5B2mmJk/view?usp=sharing

- The video contains a demonstration of the application. 
- It contains a sql query editor, quick actions section, query history section and shared query section
- The sql editor allows you to write the queries and execute them
- The quick actions shows the most frequently done actions on the app
- The query history maintains the last run queries
- As a first time user experience item, a walkthrough of the application is given through a journey cycle. It can also be accessed via help menu on the bottom right side.
- An interface is given to change the environment the editor is connected to.
- There's a functionality to add connection as well
- A user profile section is given to update the details
- The application can be toggled to dark/light mode
- Large datasets in results are handled via pagination.

The JavaScript framework you chose, along with any major plugins or packages you installed.
- I have used ReactJS along with typescript for the application development
- Used tailwind as the css library
  
The page load time of your application, and how you measured this time.
- The performance of the page comes around 95 in the green zone and the same has been measured via Lighthouse. 

Any optimisations you did to decrease the load time or increase performance.
- As little as possible Javascript is loaded to make the page load faster
- A better UX is provided via pagination
- None of the unnecessary libraries have been included to make the page load faster

