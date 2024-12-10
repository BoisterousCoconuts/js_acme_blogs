function createElemWithText(elementName = "p", textContent = "", className = "") {
    const element = document.createElement(elementName);
    element.textContent = textContent;
    if (className) {
      element.className = className;
    }
    return element;
  }
  
  function createSelectOptions(users) {
    if (!users) {
      return undefined;
    }
    const options = [];
    for (const user of users) {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      options.push(option);
    }
    return options;
  }
  
  
  //Note - postId not postID
  function toggleCommentSection(postId) {
    if (!postId) {
      return undefined;
    }
    const section = document.querySelector(`section[data-post-id = '${postId}']`);
    if (section === null) {
      return null;
    }
    section.classList.toggle("hide");
    return section;
  }
  
  function toggleCommentButton(postId) {
    if (!postId) {
      return undefined;
    }
    const commentButton = document.querySelector(`button[data-post-id = '${postId}']`);
    if (commentButton === null) {
      return null;
    }
    commentButton.textContent = commentButton.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    return commentButton;
  }
  
  function deleteChildElements(parentElement) {
    //Using MDN WebDocs for HTMLElement and instanceof
    if (!(parentElement instanceof HTMLElement)) {
      return undefined
    }
    let child = parentElement.lastElementChild;
    while (child !== null) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
    return parentElement;
  }
  
  function addButtonListeners() {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener('click', function(event){
          toggleComments(event, postId);
        });
      }
    });
    return buttons;
  }
  
  function removeButtonListeners() {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    for (let i=0; i < buttons.length; i++) {
      const button = buttons[i];
      const postId = button.dataset.postId;
      if(postId) {
        button.removeEventListener("click", (event) => {
          toggleComments(event, postId);
        });
      }
    }
    return buttons;
  }
  
  function createComments(comments) {
    if (!comments) {
      return undefined;
    }
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
      const article = document.createElement("article");
      const h3 = createElemWithText("h3", comment.name);
      const bodyParagraph = createElemWithText("p", comment.body);
      const emailParagraph = createElemWithText("p", `From: ${comment.email}`);
      article.append(h3, bodyParagraph, emailParagraph);
      fragment.appendChild(article);
    });
    return fragment;
  }
  
  function populateSelectMenu(users) {
    if (!users) {
      return undefined;
    }
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    options.forEach((option) => {
      selectMenu.appendChild(option);
    });
    return selectMenu;
  }
 
  async function getUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
    try {
      const attempt = await fetch(url);
      if (!attempt.ok) {
        throw new Error ("Could not retrieve JSON Data");
      }
      const users = await attempt.json();
      return users;
    } catch (error) {
      console.error("Function getUsers ", error);
      return undefined;
    }
  }
  
  async function getUserPosts(userId) {
    if (!userId) {
      return undefined;
    }
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    try {
      const attempt = await fetch(url);
      if (!attempt.ok) {
        throw new Error("Could not retrieve JSON Data");
      }
      const posts = await attempt.json();
      return posts;
    } catch(error) {
      console.error("Function getUserPosts ", error);
      return undefined;
    }
  }
  
  async function getUser(userId) {
    if (!userId) {
      return undefined;
    }
    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    try {
      const attempt = await fetch(url);
      if (!attempt.ok) {
        throw new Error(`Could not retrieve JSON Data`);
      }
      const user = await attempt.json();
      return user;
    } catch(error) {
      console.error("Function getUser ", error);
      return undefined;
    }
  }
  
  async function getPostComments(postId) {
    if (!postId) {
      return undefined;
    }
    const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
    try {
      const attempt = await fetch(url);
      if (!attempt.ok) {
        throw new Error(`Could not retrieve JSON Data`);
      }
      const comments = await attempt.json();
      return comments;
    } catch(error) {
      console.error("Function getPostComments ", error);
      return undefined;
    }
  }
  
  async function displayComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    const commentSection = document.createElement("section");
    commentSection.dataset.postId = postId;
    commentSection.classList.add("comments");
    commentSection.classList.add("hide");
  
    try {
      const preComments = await getPostComments(postId);
      const comments = createComments(preComments);
      commentSection.appendChild(comments);
    } catch (error) {
      console.error("Function displayComments failed to display comments: ", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Failed to load comments.";
      commentSection.appendChild(errorMessage);
    }
  
    return commentSection;
  }
  
  async function createPosts(posts) {
    if (!posts) {
      return undefined;
    }
    const postFrag = document.createDocumentFragment();
    
    for (const post of posts) {
      const article = document.createElement("article");
      const h2 = createElemWithText("h2", post.title);
      const bodyPara = createElemWithText("p", post.body);
      const postPara = createElemWithText("p", `Post ID: ${post.id}`);
      const author = await getUser(post.userId);
      const authorPara = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
      const catchPhrase = createElemWithText("p", author.company.catchPhrase);
      const commentButton = createElemWithText("button", "Show Comments");
      commentButton.dataset.postId = post.id;
      const commentSection = await displayComments(post.id);
      article.append(h2);
      article.append(bodyPara);
      article.append(postPara);
      article.append(authorPara);
      article.append(catchPhrase);
      article.append(commentButton);
      article.append(commentSection);
      postFrag.appendChild(article);
    }
    return postFrag;
  }
  
  async function displayPosts(posts) {
    const postSect = document.querySelector("main");
    let thePosts;
    if (posts) {
      thePosts = await createPosts(posts);
    }
    else {
      thePosts = createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    }
    postSect.appendChild(thePosts);
    return thePosts;
  }
    
  function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
    
    event.target.listener = true;
    
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    
    const returnSet = [section, button];
    
    return returnSet;
  }
  
  async function refreshPosts(posts) {
    if (!posts) {
      return undefined;
    }
    const removeButtons = removeButtonListeners();
    const parent = document.querySelector("main");
    const main = deleteChildElements(parent);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    
    const returnSet = [removeButtons, main, fragment, addButtons];
    
    return returnSet;
  }
  
  
  //this function does not work.
  async function selectMenuChangeEventHandler(event) {
    if (!event) {
      return undefined;
    }
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = event.target.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    
    const returnSet = [userId, posts, refreshPostsArray];
    
    return returnSet;
  }
  
  async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
  }
  
  function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
  }
  
  document.addEventListener("DOMContentLoaded", initApp);