
import Issue from '../model/Issue.mjs'
import wsServer from '../websocket.mjs'

export const listIssues = async (req, res) => {
    const projectId = '40632'

    try {
        // create issue 
        const issues = await Issue.fetchIssues(projectId)
        res.render('issues', {issues})
        //res.status(201).json(newIssue)

    } catch (error) {
        console.error('Failed to fetch issues:', error)
        res.status(500).send('Error fetching issues')
    }

    
}



export const homepage = (req, res) => {
    res.render('home')
    
  }


//extract specific data (e.g., issue title, state) and format it as needed before broadcasting
export const handleWebhook = (req, res) => {
    console.log('Expected secret:', process.env.WEBHOOK_SECRET);
    console.log('Received secret:', req.headers['x-gitlab-token']);
    
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
        console.log('Invalid token received');
        return res.status(403).send('Invalid token');
    }
    const issueData = req.body.object_attributes

    // Format the data to be sent to WebSocket clients
    const updateMessage = {
        type: 'issue-update',
        data: {
            id: issueData.id,
            title: issueData.title,
            state: issueData.state,
        }
    }

    // Broadcast the formatted issue update to all WebSocket clients
    wsServer.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN) {
            console.log('Sending message to a client')
            client.send(JSON.stringify(updateMessage))
        }
    });
    console.log('Broadcasting update to clients:', updateMessage)

    res.status(200).send('Webhook received');
}
