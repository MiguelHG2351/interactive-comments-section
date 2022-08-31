import data from './data.js'

class Message extends HTMLElement {
    iconPlus = `
        <svg class="icon-plus" width="11" height="11" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"></path>
        </svg>`
    iconMinus = `
        <svg class="icon-minus" width="11" height="3" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"></path>
        </svg>`
    iconReplay = `
        <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
        <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"></path>
        </svg>`

    constructor(username, message, timeAgo, imageURL, score, replies) {
        super()
        this.username = username
        this.message = message
        this.timeAgo = timeAgo
        this.imageURL = imageURL
        this.score = score
        this.replies = replies
    }

    messageContent(message) {
        const regex = /@([a-zA-Z0-9_]+)/g
        const messageWithMention = message.replace(regex, (match, p1) => {
            return `<span class="mention">${match}</span>`
        })

        return messageWithMention
    }

    messageBody(username, message, timeAgo, imageURL) {
        /* ---------------------------/----------------------------- */
        const $messageBody = document.createElement('div')
        /* ---------------------------|-----------------------------*/
        const $messageHeader = document.createElement('div')
        const $userFigure = document.createElement('figure')
        const $img = document.createElement('img')
        const $username = document.createElement('span')
        const $timeAgo = document.createElement('time')
        /* ---------------------------\----------------------------- */
        const $messageTxt = document.createElement('p')
        
        $messageBody.classList.add('message-body')
        $messageHeader.classList.add('message-header')
        $userFigure.classList.add('user-figure')
        $username.classList.add('username')
        $timeAgo.classList.add('time-ago')
        $messageTxt.classList.add('message-txt')

        $img.src = imageURL
        $img.setAttribute('width', 48);$img.setAttribute('alt', username)
        $userFigure.appendChild($img)

        $username.textContent = username
        $timeAgo.textContent = timeAgo
        $messageTxt.innerHTML = this.messageContent(message)

        $messageBody.appendChild($messageHeader)
        $messageHeader.appendChild($userFigure)
        $messageHeader.appendChild($username)
        $messageHeader.appendChild($timeAgo)
        $messageBody.appendChild($messageTxt)
        
        return $messageBody;
    }

    messageItemOption(count = 0) {
        /* ---------------------------/----------------------------- */
        const $messageItemOption = document.createElement('div')
        /* ---------------------------|----------------------------- */
        const $rank = document.createElement('div')
        const $buttonPlus = document.createElement('span')
        $buttonPlus.innerHTML = this.iconPlus
        /* ---------------------------|----------------------------- */
        const $countRank = document.createElement('span')
        const $messageContent = document.createTextNode(count)
        /* ---------------------------|----------------------------- */
        const $buttonMinus = document.createElement('span')
        $buttonMinus.innerHTML = this.iconMinus
        /* ---------------------------\----------------------------- */
        const $replyContainer = document.createElement('div')
        const $reply = document.createElement('span')
        $reply.innerHTML = this.iconReplay.concat(' ', 'Reply')

        $messageItemOption.classList.add('message-item-option')
        $rank.classList.add('rank')
        $buttonPlus.classList.add('button-plus')
        $countRank.classList.add('count-rank')
        $buttonMinus.classList.add('button-minus')
        $replyContainer.classList.add('reply-container')
        $reply.classList.add('reply')

        $messageItemOption.appendChild($rank)
        $messageItemOption.appendChild($replyContainer)
        $rank.appendChild($buttonPlus)
        $rank.appendChild($countRank)
        $rank.appendChild($buttonMinus)
        $countRank.appendChild($messageContent)
        $replyContainer.appendChild($reply)

        return $messageItemOption
    }

    messageItemContainer(username, message, count, timeAgo, imageURL) {
        const $messageItemContainer = document.createElement('div')
        $messageItemContainer.classList.add('message-item-container')
    
        $messageItemContainer.appendChild(this.messageBody(username, message, timeAgo, imageURL))
        $messageItemContainer.appendChild(this.messageItemOption(count))

        return $messageItemContainer
    }

    mainMessage() {
        this.appendChild(this.messageItemContainer(this.username, this.message, this.score, this.timeAgo, this.imageURL))

        if(this.replies?.length > 0) {
            const listContainer = document.createElement('ul')
            listContainer.classList.add('list-message')

            for(const reply of this.replies) {
                const replyItem = document.createElement('li')
                replyItem.setAttribute('role', 'listitem')
                replyItem.classList.add('message-item')

                console.log(reply)

                replyItem.appendChild(this.messageItemContainer(reply.user.username, reply.content, reply.score, reply.createdAt, reply.user.image.webp))
                listContainer.appendChild(replyItem)
            }
            this.appendChild(listContainer)
        }
    }

    render() {
        this.setAttribute('role', 'listitem')
        this.classList.add('message-item')
        this.mainMessage()
    }
    
    connectedCallback() {
        this.render()
    }
}


customElements.define('message-element', Message)

const test = document.getElementById('list-message')
for (const comment of data.comments) {
    const message  = new Message(comment.user.username, comment.content, comment.createdAt, comment.user.image.webp, comment.score, comment.replies)

    test.appendChild(message)
}
