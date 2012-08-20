#Token Web Service 

## Function

Enables communication between the token client application and the web server/general database. The database stores two types of data: Users and Transactions. Each user object is defined by a Facebook ID number. Currently the User object has no relevant information for the Client (eventually will have achievements/badges). 

There are currently four resources: "login", "addFriend", "addTransaction" and "syncTransactions". 
Resource "login" should be queried at the beginning of a session if the Client does not have any User data loaded. After this is completed, "addFriend" and "addTransaction" can be called to update the server database from user actions performed in the Client. The Client is also responsible for calling "syncTransactions" periodically to receive relevant data updates from the Server. 

All POST data is in JSON format. 

##Resources 

###Login: 


<table table cellspacing="0" cellpadding="4">
    <tr>
       <td><b>URL<b></td> 
       <td>&lt;base&gt;/login</td> 
    </tr>
   <tr>
       <td><b>Method Type<b></td> 
       <td>POST</td> 
    </tr>
</table>

<b>Description:</b>

Login will check if a user already exists for the provided ID and create one if not - all other resources are dependent on having an already initialized user object in the database. Currently login only functions to ensure there is a record in the database - there is no response data. The Client should call syncTransactions after a successful login to pull down the user's transaction data. 

To Do: 

* Add support for multiple registration platforms
* Return more detailed user data  (badges, achievements etc.) 

<b>Parameters</b>: 

* <b>userID [INTEGER]  :</b> registration ID for user.  (required)
* <b>registrationPlatform [TEXT] : </b> Currently unused, only Facebook is supported (optional)

<b>Success Response</b>: 

* <b>Message  :</b> "Login Successful"

<b>Error Reponse</b>: 
<br> 
<table table border="1" cellspacing="0" cellpadding="4">
    <tr>
       <td><b>Code<b></td> 
       <td><b>Message<b></td> 
       <td><b>Description<b></td> 
    </tr>
   <tr>
       <td>101</td> 
       <td>"Missing userID property" </td> 
       <td>No userID key posted in JSON </td> 
    </tr>
 <tr>
       <td>101</td> 
       <td>"No data posted " </td> 
       <td>No data object found</td> 
    </tr>
 <tr>
       <td>102</td> 
       <td>"Invalid data posted"</td> 
       <td>Posted userID is in incorrect format (not an integer)</td> 
    </tr>
<tr>
       <td>301</td> 
       <td>"'Failed to create record for user"</td> 
       <td> There was an error reating record in database</td> 
    </tr>
</table>
<br>


###Add Friend: 


<table table cellspacing="0" cellpadding="4">
    <tr>
       <td><b>URL<b></td> 
       <td>&lt;base&gt;/user/:userID:/addFriend</td> 
    </tr>
   <tr>
       <td><b>Method Type<b></td> 
       <td>POST</td> 
    </tr>
</table>


<b>Description:</b>

AddFriend takes the given userID and makes a friend relationship between the user with that ID and the user with the posted friendID. The userID must already be registered in the database, however if the friendID does not correspond to an already created record a new user record will be created for it. This method is currently not required in the application flow - the add transaction route includes this functionality. This method may be removed. 

<b>Parameters</b>: 

* <b>friendID [INTEGER]  :</b> registration ID for friend to add   (required)

<b>Success Response</b>: 

* <b>Message  :</b> "Added friend [friendID] to user [userID]"

<b>Error Reponse</b>: 
<br> 
<table table border="1" cellspacing="0" cellpadding="4">
    <tr>
       <td><b>Code<b></td> 
       <td><b>Message<b></td> 
       <td><b>Description<b></td> 
    </tr>
     <tr>
       <td>101</td> 
       <td>"No data posted " </td> 
       <td>No data object found</td> 
    </tr>
   <tr>
       <td>101</td> 
       <td>"Missing friendID property" </td> 
       <td>No friendID key posted in JSON </td> 
    </tr>
     <tr>
       <td>103</td> 
       <td>"No user found for id"</td> 
       <td>UserID provided in URL not found in database</td> 
    </tr>
 <tr>
       <td>102</td> 
       <td>"Invalid data posted"</td> 
       <td>Posted friendID is in incorrect format (not an integer)</td> 
    </tr>
<tr>
       <td>301</td> 
       <td>"'Failed to create record for user"</td> 
       <td> An error occurred creating record in database</td> 
    </tr>
    <tr>
       <td>302</td> 
       <td>"Failed to add friend [friendID] to user [userID]"</td> 
       <td>An error occurred updating the user record in the database</td> 
    </tr>
</table>
<br>


###Add transaction:

<table table cellspacing="0" cellpadding="4">
    <tr>
       <td><b>URL<b></td> 
       <td>&lt;base&gt;/user/:userID:/addTransaction</td> 
    </tr>
   <tr>
       <td><b>Method Type<b></td> 
       <td>POST</td> 
    </tr>
</table>

<b>Description:</b>

Add Transaction records a token exchange between two users. 

<b>Parameters:</b> 

* <b>recipientID [INTEGER]  :</b> registration ID for recipient user  (required)
* <b>tokenValue [INTEGER]  :</b> token value for transaction   (required)
* <b>actionName [TEXT]  :</b> name of transaction action  (required)
* <b>time [DATE]  :</b> time transaction occurred   (required)
* <b>comment [TEXT]  :</b> user provided comment   (optional)

<b>Success Response</b>: 



<b>Error Reponse</b>: 
<br> 
<table table border="1" cellspacing="0" cellpadding="4">
    <tr>
       <td><b>Code<b></td> 
       <td><b>Message<b></td> 
       <td><b>Description<b></td> 
    </tr>
</table>
<br>