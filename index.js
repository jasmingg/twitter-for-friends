import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://twitter-for-friends-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const tweetContentInDB = ref(database, "tweet-content")

const publishButton = document.getElementById("publish-button")
const userTweetContent = document.getElementById("inputTweet")
const userFromInput = document.getElementById("from-input")
const userToInput = document.getElementById("to-input")
const listOfTweets = document.getElementById("all-tweets")

let postNum = 1;

publishButton.addEventListener("click", function() {
  if (userTweetContent.value && userFromInput.value && userToInput.value) {
    console.log('this is running')
    publishButton.textContent = "Send Tweet"
    publishButton.style.backgroundColor = "#1DA1F2"
    let tweetValue = userTweetContent.value
    let fromValue = userFromInput.value
    let toValue = userToInput.value

    let newTweetRef = push(tweetContentInDB)

    // Set the content of the new tweet
    set(newTweetRef, {
        content: tweetValue,
        from: fromValue,
        to: toValue,
        likes: 0
      }
    )

    clearTweetInputs()
  }
  else {
    publishButton.textContent = "Error: fill in all inputs"
    flashRed()
  }
})

function clearTweetInputs () {
  userTweetContent.value=""
  userFromInput.value = ""
  userToInput.value = ""
}

onValue (tweetContentInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())
          clearAllTweets ()
            for (let i = 0; i < itemsArray.length; i++) {
                let currentTweet = itemsArray[i]
                let tweetData = currentTweet[1]
                appendInputsToDisplay(tweetData.content, tweetData.from, tweetData.to, currentTweet[0], tweetData.likes)
                console.log(tweetData.content, tweetData.from, tweetData.to, currentTweet[0], tweetData.likes)
            }
          }
  else {
    listOfTweets.innerHTML = "<p id='empty-tweets'>No tweets yet...</p>";
  }
        })


function clearAllTweets () {
  listOfTweets.innerHTML =""
}

function appendInputsToDisplay(tweet, from, to, tweetID, likes) {
let newBox = document.createElement('li')
let newTweet = document.createElement('p')
let newFrom = document.createElement('span')
let newTo = document.createElement('span')

let newBreak1 = document.createElement('br');
let newBreak2 = document.createElement('br');

let newHeartDIV = document.createElement('div')
newHeartDIV.classList.add("heartDIV")
let heartIcon = document.createElement('span')
let likesNum = document.createElement('span')
likesNum.classList.add("likesDistance")


heartIcon.innerHTML = '&#10084;'
likesNum.innerText = likes;


newFrom.textContent = `from ${from}` 
newTo.textContent  = `to ${to}`
newTweet.textContent = tweet

newHeartDIV.append(heartIcon, likesNum)
newBox.append (newFrom, newBreak1, newTweet, newBreak2, newTo, newHeartDIV)
listOfTweets.append(newBox)

newHeartDIV.addEventListener('click', function () {
  let currentLikes = parseInt(likesNum.innerText, 10)
  let newLikes = currentLikes + 1
  likesNum.innerText = newLikes


  let tweetRef = ref(database, `tweet-content/${tweetID}`)
  update(tweetRef, {
      likes: newLikes
  })
  })


  
}




// turns the blue "send tweet" button into a red "error" message for a set time
function flashRed() {
  publishButton.classList.remove("blue-publish")
  publishButton.classList.add("red-publish")
  setTimeout(function(){
      publishButton.classList.remove('red-publish')
      publishButton.classList.add("blue-publish")
      publishButton.textContent = "Send Tweet"
  }, 1500)
}
