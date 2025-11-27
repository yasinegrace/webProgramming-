import axios from 'axios'

class Issue {
  constructor({ id, title, description, assignee_ids, labels,web_url,state }) {
    this.id = id
    this.title = title
    this.description = description
    this.assignee_ids = assignee_ids
    this.labels = labels
    this.web_url = web_url // to the issue on gitlab
    this.state = state
  }

  /**
   * 
   * @param {*} data 
   * @returns data fetched from gitlab
   */
  static fromGitLabData(data) {
    return new Issue({
      id: data.id,
      title: data.title,
      description: data.description,
      assignee_ids: data.assignees ? data.assignees.map(assignee => assignee.id) : [],
      labels: data.labels,
      web_url: data.web_url,
      state: data.state
    });
}

  static async fetchIssues(projectId) {
    try {

      const url = `https://gitlab.lnu.se/api/v4/projects/${projectId}/issues`

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${process.env.GITLAB_API_TOKEN}`,
        }
      })

      return response.data.map(issueData => Issue.fromGitLabData(issueData))
    } catch (error) {
      console.error('Error fetching  the issue on GitLab:', error.response ? error.response.data : error.message)
      throw error
    }
  }
}

export default Issue
