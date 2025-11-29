import Index from './modules/index.mjs'

const app = async () => {
    try {
        const [, , url] = process.argv;
        if (!url) {
            console.error('URL must be provided as a command line argument.')
            process.exit(1)
        }

        const application = new Index()
        await application.start(url)
    } catch (error) {
        console.error(`An error occurred: ${error.message}`)
        process.exit(1)
    }
}

app()
