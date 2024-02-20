/**
 * Entry point
 * @version 1.0.0
 *  - Natural Language Processing - Language Recognition
 *  @author Ismail BASSAOUD | Aelion - 2024-02 <ismail.bassaoud@gmail.com>
 */

class Main {
 constructor(){
    this.#bootstrap();
 }

 async #bootstrap(){
    console.log("Hello world!") 
 }
}

(
    () => {
        const app = new Main();
    }
)();
