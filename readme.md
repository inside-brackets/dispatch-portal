## Dispatch Portal

An ERP for dispatchers

### How to Setup

Project has two components: client and server.
To set up client (front-end fo the app) go to client directory

```
cd client
```

and install dependencies

```
npm install
```

To start the react app

```
npm start
# make sure you are still in client directory
```

In a new terminal go to server directory

```
cd server
```

Install dependencies as well

```
npm install
```

To start the express app

```
npm start
# make sure you are still in server directory
```

### Github branch management

We are using git flow for branch management.

https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

**The overall flow of Gitflow is:**

1. A staging branch is created from main
2. Feature branches are created from staging with the prefix `feature_`
3. Bugfix branches are created from staging with the prefix `bugfix_`
4. When a feature/bugfix is complete it is merged into the staging branch
5. A release branch is created from staging
6. When the release branch is done it is merged into staging and main
7. If an issue in main is detected a hotfix branch is created from main
8. Once the hotfix is complete it is merged to both staging and main
