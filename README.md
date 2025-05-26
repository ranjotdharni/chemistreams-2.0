![ChemiStreams][titleImg]

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Synopsis](#synopsis)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
  - [Creating a Chat](#creating-a-chat)
  - [Direct Chat](#direct-chat)
    - [View Profile](#view-profile)
  - [Group Chat](#group-chat)
    - [View Group Members](#view-group-members)
  - [Attachments](#attachments)
  - [Spotify Embeds](#spotify-embeds)
  - [YouTube Embeds](#youtube-embeds)
  - [Profile](#profile)
    - [Edit Your Profile](#edit-your-profile)
    - [Badges](#badges)
  - [Toolbar](#toolbar)
    - [Toolbar Reference](#toolbar-reference)
- [Issues](#issues)
- [Contribution](#contribution)
  - [To Do List](#to-do-list)
    - [Functional](#functional)
    - [Non-functional](#non-functional)

# Synopsis

**ChemiStreams** is a browser-to-browser chat application. **Message your friends, create group chats, and customize your profile to stand out.** Share your favorite 
music and videos with your friends using our **Spotify** and **YouTube** embedding features. This web app is a remake of an existing web app; the original ChemiStreams was one of the very first 
web apps created by the maker of ChemiStreams (a simple HTML, CSS, and JavaScript website). Years later, the creator of ChemiStreams remade this application using more robust 
tools to ensure the best experience for users, and create a more functional version of the web app. Enjoy chatting with friends using our easy-to-use, simple interface (all icons by [Icons8][icons8Link]). ChemiStreams is available to access [here][appLink].

# Tech Stack

ChemiStreams was built on the following **technologies:**

- [![Node][nodeImg]][nodeLink] *v22.11.0*
- [![React][reactImg]][reactLink] *v19.0.0*
- [![Next][nextImg]][nextLink] *v15.2.4*
- [![TypeScript][typescriptImg]][typescriptLink] *v5.0.0*
- [![Firebase][firebaseImg]][firebaseLink] *v11.6.0*
- [![Vercel][vercelImg]][vercelLink]

This is a **Next 15** project, therefore it is a **React** app at its core, which employs **Node.js** with **TypeScript** and uses **Vercel** to host the application, and **Firebase** 
for user authentication and database.

# Usage
Navigate to ChemiStreams and click the *Log In* button on the navigation bar to sign in to your account. This will redirect you to the login page.*

![Log In Screen][loginScreenshot]
**You may also choose to sign up if you're not an existing user*

## Creating a Chat

Once you are logged in, you will initially have no chats in your *Chat List.*

![Empty Chat Screenshot][emptyChatScreenshot]

Use the search bar at the top of the Chat List to find other users by their username. Click the *Plus* icon to the right of the search bar to add a user 
to the Chat you're about to create.

![Search Bar Screenshot][searchBarScreenshot]

After you have the list of users you want added to your Chat, click the *Create* button to create the Chat. If you add only one user to a Chat, ChemiStreams will 
create a **Direct Chat.** Adding more than one user to a Chat will create a **Group Chat.**

**It is always best practice to sign out when you are done using ChemiStreams (or any web app for that matter).*

## Direct Chat

Enter your message in the input at the bottom of the *Chat View,* and click the send button to the right (or hit Enter on your keyboard) 
to send a message.

![Direct Chat Screenshot][directChatScreenshot]

Your Chat recipient(s) will see you typing and receive your messages in real time.

### View Profile

Click on your Chat recipient's profile picture in the *Chat Header* at the top of the Chat View to **view their profile.**

![Direct Profile View][directProfileView]

## Group Chat

Add multiple recipients when creating a Chat to create a Group Chat.

![Group Chat Screenshot][groupChatScreenshot]

Click the *Edit* icon in the top right of the Group Chat View to change your Group Chat's name.

![Edit Group Chat][editGroupChat]

Click the *Save* button to propagate any changes. Click the *Edit* icon again to close the editor.

### View Group Members

Click the *View Members* button under the Group Chat name to see all the recipients in the current Chat.

![View Members Screenshot][viewMembersScreenshot]

You can click on a Group Member in the displayed list to view their profile.

## Attachments

While in a Chat, click the *Paperclip* icon in the bottom left of the Chat View to send an image. Choose the image file to 
send using the modal menu that pops up.

![Upload File Screenshot][uploadFileScreenshot]

Click the *Send* button to send a picture to your recipient(s).*

**Currently, ChemiStreams only supports image files. We are working on exapnding this functionality to allow you 
to send video and audio as well.*

## Spotify Embeds

Navigate to *Spotify* and find a track, album, playlist, artist, podcast, or audiobook that you want to send in your Chat. Click the three dots icon on the 
Spotify resource and hover over the *Share* option. Click *Copy Link* from the menu that pops up to get the link to the resource.

![Spotify Share Screenshot][spotifyShareScreenshot]

Once you have the link, navigate back to the Chat View and click the *Music Note* icon in the bottom left of the Chat View 
to open the Spotify Embed modal. Paste the copied link into the input and click *Send.*

![Spotify Embed Screenshot][spotifyEmbedScreenshot]

ChemiStreams will embed the Spotify resources you send into your messages so your recipient(s) will be able to access them directly from your Chat(s)!

## YouTube Embeds

Similar to Spotify Embeds, you can get the link for YouTube videos as well to share them with your Chat(s). 

![YouTube Share Screenshot][youtubeShareScreenshot]

Again, ChemiStreams will embed YouTube videos you send into your messages for your recipient(s) to access directly from your Chat(s).

![YouTube Embed Screenshot][youtubeEmbedScreenshot]

## Profile

Click the *Profile Edit* icon in the top of the **Toolbar** on the left of the screen to view your **Profile.**

![Profile View Screenshot][profileViewScreenshot]

### Edit Your Profile

From the *Profile View,* you can upload a new **Profile Picture,** edit your **Display Name,** and edit your **Status.** Don't forget to click 
*Save* after editing your Profile to make sure your changes are saved.

![Profile Edit Screenshot][profileEditScreenshot]

### Badges

In the Profile View, you can assign yourself a **Badge** which can be static, or animated. Select an animation from the displayed list to preview it, then click on a Badge from 
the displayed list to assign it to your Profile. Don't forget to click the *Save* button below the Badge list to save your changes.

![Badge Edit Screenshot][badgeEditScreenshot]

Recipients in your Chats will be able to view the Badge you assign yourself with the animation you've selected for it.

## Toolbar

On the left side of the screen, you can find the **Toolbar.** It offers various functionalities for interacting with ChemiStreams. From here, you can open 
the Profile View, delete a Chat (if you are the owner of said Chat), and more.

For example, click the *Paint Bucket* icon in the Toolbar to toggle between light and dark mode.

![Light Mode Screenshot][lightModeScreenshot]

### Toolbar Reference

| Button                        | Name      | Description |
| --------------------------- | ------------- | ----------- |
| ![PFP Button][pfpButton]          | **View Profile**           | View or edit your profile. |
| ![Paint Button][paintButton]                 | **Change Theme**             | Toggle between light and dark mode. |
| ![Trash Button][trashButton]                | **Delete**             | Delete the currently highlighted chat (if you are its owner). |
| ![Logout Button][logoutButton]                     | **Log Out**             | Log out of ChemiStreams. |
| ![Back Button][backButton]                        | **Go Back**            | Go back to the previous screen or close the current chat. |

# Issues

Create an [issue][issueLink] if you need to contact us about an existing problem or bug in ChemiStreams. It may take some time for us to respond to and resolve complex issues.

# Contribution

Fork this repository and open a [pull request][contributionLink] to suggest any feature additions. Your request will be reviewed and responded to accordingly.

## To Do List

### Functional
- [x] UI
- [x] Firebase Realtime
- [x] Google, Github Auth Providers
- [x] Media Files
- [x] Edit Profile
- [x] Change Theme
- [x] Responsive Design
- [x] Database Rules
- [x] Documentation

### Non-functional
- [ ] Migrate to Cloudinary Cluster
- [ ] Add/Remove/Kick after creation
- [ ] Block List
- [ ] OEmbed Links
- [ ] Pagination
- [ ] API
- [ ] Synchronize users in auth w/ realtime (sign up + sign in)
- [ ] Email validation (client sign up + confirmation)

[titleImg]: /readmeAssets/titleImg.png
[loginScreenshot]: /readmeAssets/loginImg.png
[emptyChatScreenshot]: /readmeAssets/emptyChat.png
[searchBarScreenshot]: /readmeAssets/searchBar.png
[directChatScreenshot]: /readmeAssets/directChat.png
[directProfileView]: /readmeAssets/directProfileView.png
[groupChatScreenshot]: /readmeAssets/groupChat.png
[editGroupChat]: /readmeAssets/editGroupChat.png
[viewMembersScreenshot]: /readmeAssets/viewMembers.png
[uploadFileScreenshot]: /readmeAssets/uploadFile.png
[spotifyShareScreenshot]: /readmeAssets/spotifyShare.png
[spotifyEmbedScreenshot]: /readmeAssets/spotifyEmbed.png
[youtubeShareScreenshot]: /readmeAssets/youtubeShare.png
[youtubeEmbedScreenshot]: /readmeAssets/youtubeEmbed.png
[profileViewScreenshot]: /readmeAssets/profileView.png
[profileEditScreenshot]: /readmeAssets/profileEdit.png
[badgeEditScreenshot]: /readmeAssets/badgeEdit.png
[lightModeScreenshot]: /readmeAssets/lightMode.png
[pfpButton]: /readmeAssets/pfpButton.png
[paintButton]: /readmeAssets/paintButton.png
[trashButton]: /readmeAssets/trashButton.png
[logoutButton]: /readmeAssets/logoutButton.png
[backButton]: /readmeAssets/backbutton.png

[typescriptImg]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[reactImg]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=1c2c4c
[nextImg]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[nodeImg]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[vercelImg]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[firebaseImg]: https://img.shields.io/badge/Firebase-FF9100?style=for-the-badge&logo=firebase&logoColor=white

[appLink]: https://chemistreams.vercel.app
[icons8Link]: https://icons8.com
[typescriptLink]: https://www.typescriptlang.org/
[reactLink]: https://react.dev/
[nextLink]: https://nextjs.org/
[nodeLink]: https://nodejs.org/
[vercelLink]: https://vercel.com
[firebaseLink]: https://firebase.google.com
[issueLink]: https://github.com/ranjotdharni/chemistreams-2.0/issues
[contributionLink]: https://github.com/ranjotdharni/chemistreams-2.0/pulls