const ILanguageProcessor = require("./ILanguageProcessor");
const { NlpManager } = require("node-nlp");
const compromise = require("compromise");
const frCompromise = require("fr-compromise");
const pluralize = require("pluralize");

class LanguageProcessor extends ILanguageProcessor {
  constructor() {
    super();
    this.manager = new NlpManager({ languages: ["fr"], forceNER: true });
    this.#init();
  }

  #init() {
    this.#addSalutationDocuments();
    this.#addStockDocuments();
    this.#addAnswers();
  }

  #addSalutationDocuments() {
    // Salution : Bonjour
    const greetings = [
      "Bonjour",
      "Salut",
      "Salut tout le monde",
      "Bonsoir",
      "Coucou",
    ];
    greetings.forEach((greeting) => {
      this.addDocument("fr", greeting, "salutation.bonjour");
    });

    // Salution : Au revoir
    const goodbyes = [
      "Au revoir",
      "Je dois y aller",
      "Je m'en vais!",
      "Je m'en vais à bientôt!",
      "Adieu",
      "A la revoyure",
      "Salut à plus tard",
      "A la prochaine",
      "Ciao",
    ];
    goodbyes.forEach((goodbye) => {
      this.addDocument("fr", goodbye, "salutation.aurevoir");
    });
  }

  /**
   * Adds documents related to stock operations in the language model.
   * Documents include commands for adding, removing, and checking stock.
   * Also includes ambiguous queries about stock.
   */
  #addStockDocuments() {
    // TODO: Possible de ne pas faire des phrases mais d'aligner les mots clés et le map avec l'intent approprié ?
    // Les "le", "de", "du", "au" etc. rendent la tâches plus complexes
    this.addDocument(
      "fr",
      "Ajouter le produit %product% à la liste de course",
      "stock.add-to-shop-list"
    );
    this.addDocument(
      "fr",
      "Tu peux m'ajouter le produit %product% à la liste de course",
      "stock.add-to-shop-list"
    );
    this.addDocument(
      "fr",
      "Tu peux me rajouter le produit %product% à la liste de course",
      "stock.add-to-shop-list"
    );
    this.addDocument(
      "fr",
      "Tu peux me rajouter le produit %product% à la liste de course, , s'il te plait",
      "stock.add-to-shop-list"
    );
    this.addDocument(
      "fr",
      "Ajouter au stock La quantité %quantity% pour le produit %product%",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "M'ajouter au stock La quantité %quantity% pour le produit %product%",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "M'ajouter au stock La quantité %quantity% pour le produit %product%, s'il te plait",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Rajoute moi %quantity% %product% à mon stock, s'il te plait",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Rajoute moi, s'il te plait, %quantity% %product% à mon stock",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Tu peux me rajouter s'il te plait %quantity% %product% au stock",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Rajoute au stock La quantité %quantity% pour le produit %product%",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Me rajouter au stock La quantité %quantity% pour le produit %product%",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Me rajouter au stock La quantité %quantity% pour le produit %product%, s'il te plait",
      "stock.add-to-stock"
    );
    this.addDocument(
      "fr",
      "Retirer du stock La quantité %quantity% pour le produit %product%",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Retirer du stock La quantité %quantity% pour le produit %product%, s'il te plait",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Retire, s'il te plait, du stock %quantity% %product%",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Enlèver du stock La quantité %quantity% pour le produit %product%",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Enlèver du stock La quantité %quantity% pour le produit %product%, s'il te plait",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Enlèver du stock  %quantity% %product%, s'il te plait",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Enlève, s'il te plait, du stock %quantity% %product%",
      "stock.remove-from-stock"
    );
    this.addDocument(
      "fr",
      "Tu peux me retirer, s'il te plait, stock %quantity% %product%",
      "stock.remove-from-stock"
    );

    // Question checking stock
    this.addDocument(
      "fr",
      "Demander s'il reste le produit %product% dans le stock",
      "stock.check-stock"
    );
    this.addDocument(
      "fr",
      "Il me reste combien de %product% dans le stock?",
      "stock.check-stock"
    );
    this.addDocument(
      "fr",
      "Vérifie le stock de %product%",
      "stock.check-stock"
    );
    this.addDocument(
      "fr",
      "Vérifie dans mon stock le produit %product%",
      "stock.check-stock"
    );
    this.addDocument(
      "fr",
      "Regarde si le produit %product% est dans mon stock",
      "stock.check-stock"
    );
    this.addDocument(
      "fr",
      "Regarde si %product% est disponible dans mon stock",
      "stock.check-stock"
    );

    // Ambiguous queries
    this.addDocument(
      "fr",
      "%quantity% %product% en stock",
      "stock.ambiguous-stock-query"
    );
    this.addDocument(
      "fr",
      "Stock de %quantity% %product%",
      "stock.ambiguous-stock-query"
    );
  }

  #addAnswers() {
    // Answers for greetings
    const greetingAnswers = [
      "Bonjour! Comment puis-je vous aider aujourd'hui?",
      "Salut! En quoi puis-je vous assister?",
      "Salut! Comment puis-je vous être utile?",
      "Salut tout le monde! Que puis-je faire pour vous?",
    ];
    greetingAnswers.forEach((answer) => {
      this.addAnswer("fr", "salutation.bonjour", answer);
    });

    // Answers for goodbyes
    const goodbyeAnswers = [
      "Au revoir! N'hésitez pas à revenir si vous avez d'autres questions.",
      "Au revoir! Passez une excellente journée!",
      "À bientôt! Si vous avez besoin d'aide, je suis là.",
      "Ciao! Prenez soin de vous.",
    ];

    goodbyeAnswers.forEach((answer) => {
      this.addAnswer("fr", "salutation.aurevoir", answer);
    });

    this.addAnswer(
      "fr",
      "stock.add-to-shop-list",
      "L'opération d'ajout de %quantity% %product% à la liste de courses a été effectuée avec succès."
    );
    this.addAnswer(
      "fr",
      "stock.add-to-stock",
      "L'opération d'ajout de %quantity% %product% au stock a été effectuée avec succès."
    );
    this.addAnswer(
      "fr",
      "stock.remove-from-stock",
      "L'opération de retrait de %quantity% %product% du stock a été effectuée avec succès."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock",
      "Oui, le produit %product% est toujours disponible dans le stock."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock",
      "Il reste %quantity% %product% dans le stock."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock",
      "Vous avez ecore %quantity% %product% dans votre stock."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock",
      "Il vous reste %quantity% %product% dans votre stock."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock",
      "Votre stock à l'heure actuelle contient %quantity% %product%."
    );
    // Answers for when the product is not available in stock
    this.addAnswer("fr", "stock.check-stock.unavailable", "Désolé, le produit %product% n'est plus disponible dans le stock.");
    this.addAnswer(
      "fr",
      "stock.check-stock.unavailable",
      "Le produit %product% n'est plus disponible en stock."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock.unavailable",
      "Le produit %product% n'est plus disponible."
    );
    this.addAnswer(
      "fr",
      "stock.check-stock.unavailable",
      "Le produit %product% n'est plus en stock."
    );

    // Ambiguous queries
    this.addAnswer(
      "fr",
      "stock.ambiguous-stock-query",
      "Voulez-vous ajouter ou retirer des articles du stock?"
    );
  }

  /**
   * Trains the language model and saves it for future use.
   * @throws {Error} Throws an error if training or saving fails.
   */
  async trainAndSaveModel() {
    try {
      // Train the language model
      await this.manager.train();

      // Save the trained model
      this.manager.save();

      // Log success message
      console.log("Language model trained and saved successfully");
    } catch (error) {
      // Handle any errors during training or saving
      console.error(
        "Error while training and saving the language model:",
        error
      );
      throw error;
    }
  }

  /**
   * Processes a natural language query, extracts entities, and handles product-related queries.
   *
   * @param {string} language - The language of the query.
   * @param {string} query - The natural language query to process.
   * @returns {Object} - The response object containing the processed query and answer.
   */
  async processQuery(language, query) {
    // Use compromise to parse the query and extract entities
    const parsedQuery = compromise(query);
    const nounMatch = frCompromise(query).match("#Noun").json();

    // Extract quantity from the query
    const quantity = parseInt(parsedQuery.match("#Value").out("array")[0]);

    // Define unwanted tags to filter out from the noun phrase
    const unwantedTags = ["Pronoun", "Verb", "Adjective"];

    // Define unwanted words to filter out from the nouns
    const unwantedWords = [
      "product",
      "products",
      "stock",
      "stocks",
      "s'il",
      "s'il te plait",
      "s'il vous plait",
      "me",
      "te",
      "mon",
    ];

    // Extract nouns excluding unwanted tags and words from the noun phrase
    const nouns = nounMatch
      .filter(
        (term) => !unwantedTags.some((tag) => term.terms[0].tags?.includes(tag))
      )
      .map((term) => term.text.toLowerCase())
      .filter((word) => !unwantedWords.includes(word));

    // Generate the product name by pluralizing the cleaned nouns
    const product =
      nouns.length > 0 ? pluralize(nouns.join(" "), quantity) : null;

    // Process the query
    const response = await this.manager.process(language, query);

    // In case it's related to quantity
    this.replaceQuantityPlaceholder(response, quantity);
    // In case it's related to product
    this.replaceProductPlaceholder(response, product);

    return response;
  }

  /**
   * Replaces the quantity placeholder in the response with the actual quantity.
   * @param {Object} response - The response object.
   * @param {number} quantity - The quantity value to replace in the response.
   */
  replaceQuantityPlaceholder(response, quantity) {
    // Check if quantity and response are available
    if (quantity && response && response.answer) {
      // Replace the quantity placeholder with the actual quantity
      const formattedResponse = response.answer.replace(/%quantity%/g, quantity);
      response.answer = formattedResponse;
    }
  }

  /**
   * Replaces the product placeholder in the response with the actual product name.
   * @param {Object} response - The response object.
   * @param {string} product - The product name to replace in the response.
   */
  replaceProductPlaceholder(response, product) {
    // Check if product and response are available
    if (product && response && response.answer) {
      // Replace the product placeholder with the actual product name
      const formattedResponse = response.answer.replace(/%product%/g, product);
      response.answer = formattedResponse;
    }
  }

  /**
   * Adds a document to the language manager for training.
   * @param {string} language - The language of the document.
   * @param {string} utterance - The text of the document.
   * @param {string} intent - The intent associated with the document.
   */
  addDocument(language, utterance, intent) {
    this.manager.addDocument(language, utterance, intent);
  }

  /**
   * Adds an answer to the language manager for training.
   * @param {string} language - The language of the answer.
   * @param {string} intent - The intent associated with the answer.
   * @param {string} answer - The text of the answer.
   */
  addAnswer(language, intent, answer) {
    this.manager.addAnswer(language, intent, answer);
  }
}

module.exports = LanguageProcessor;
