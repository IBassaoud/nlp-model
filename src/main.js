/**
 * Entry point
 * @version 1.0.0
 *  - Natural Language Processing - Language Recognition
 *  @author Ismail BASSAOUD | Aelion - 2024-02 <ismail.bassaoud@gmail.com>
 */

const express =  require('express');
const LanguageProcessor  = require('./core/models/language-processor/languageProcessor')

class Main {
 constructor(){
    this.#bootstrap();
 }

 async #bootstrap(){
    const app = express();
    const port = 3000;

    app.use(express.json());
    app.use(express.static('dist'));


    app.get('/', async (req,res) => {
        res.sendFile(__dirname + '/disct/index.html');
    })

    const languageProcessor = new LanguageProcessor();
    await languageProcessor.trainAndSaveModel();

    // Text query endpoint
    app.post('/process-query', async (req, res) => {
        const query = req.body.query;
        const lang = req.body.lang;
        const response = await languageProcessor.processQuery(lang, query);
        res.json({ query, response: response && response.answer ? response.answer : 'Please rephrase your request' });
    })

    // Voice recognition endpoint
    app.post('/process-voice', async (req, res) => {
        try {
          const voiceCommand = req.body.voiceCommand;
      
          // Process the voice command using your language processor
          const languageProcessor = new LanguageProcessor();
          await languageProcessor.trainAndSaveModel();

          const response = await languageProcessor.processQuery('fr', voiceCommand);
      
          res.json({ voiceCommand, response: response && response.answer ? response.answer : 'Please rephrase your request' });
        } catch (error) {
          console.error('Error processing voice command:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

 }
}

(
    () => {
        const app = new Main();
    }
)();
