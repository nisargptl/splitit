**Inspiration** <br/>
The inspiration for SmartSplit stemmed from our fascination with the capabilities of Optical Character Recognition (OCR) technology and its potential to simplify everyday tasks. We noticed that splitting bills after group outings was a common pain point—manually calculating each person's share was time-consuming and often led to errors. We thought, what if we could harness OCR to automatically read and process bills? This idea excited us, as it combined cutting-edge technology with a practical solution to a real-world problem. Our goal became clear: create an app that leverages OCR to make expense splitting effortless and accurate.


**How We Built SmartSplit** <br/>
**1. Frontend Development:** <br/>
We chose React with TypeScript for the frontend to create a responsive and user-friendly interface. TypeScript provided type safety, which helped catch errors early and made the codebase more maintainable. The UI allows users to effortlessly upload photos of their bills and view the split expenses in a clear and organized manner. <br/>
For setup run below commands: <br/>
i. npm i <br/>
ii. npm start <br/>

**2. Backend Development:** <br/>
Our backend is powered by Node.js, which offers a robust environment for building scalable network applications. We focused on creating efficient APIs to handle user requests and process data securely. </br>
For setup run below commands: <br/>
i. npm i <br/>
ii. npm run dev <br/>

**3. Authentication:** <br/>
To ensure secure user authentication and authorization, we integrated OAuth using Okta. This approach provided a reliable and secure method for users to sign up and log in, protecting sensitive information.

**4. Database Management:** <br/>
We utilized MongoDB Atlas as our database solution due to its flexibility and scalability in handling unstructured data. It allowed us to store user information, transaction details, and other necessary data efficiently.

**5. OCR and Data Processing:** <br/>
The core feature of SmartSplit revolves around processing images of bills to extract and interpret data: <br/>
*Amazon Textract:* Employed for its powerful OCR capabilities to extract text from uploaded bill images accurately. <br/>
*ChatGroq Integration:* Used to parse the extracted text and identify individual transactions and their corresponding prices. <br/>
*AWS Lambda & API Gateway:* Deployed our OCR processing code on AWS Lambda, enabling serverless execution, and used API Gateway to manage API calls securely and efficiently.
