import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  function validateUrl(URL: string) {
    var querying =
      "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(querying, "i");
    return url.test(URL);
  }
  
  app.get("/filteredimage", async (req, res) => {
    // Validating the image_url query
    var imageUrl = req.query.imageUrl;
    var is_validUrl = validateUrl(imageUrl);

    if (is_validUrl) {
      // Calling filterImageFromURL(image_url) to filter the image
      var image_path = await filterImageFromURL(imageUrl);
      // Creating our available options for file sent
      var options = {
        dotfiles: "deny",
        headers: {
          timestamp: Date.now(),
          sent: true,
        },
      };
      // Sending the result file to the response
      res.sendFile(image_path, options, function (err) {
        // Error handling display/notification for out invalid image_url
        if (err) {
          res.status(400).send("Cannot access image");
        } else {
          // Deleting any files on the server when the response is received
          deleteLocalFiles([image_path]);
        }
      });
    } else {
      res.status(404).send("Cannot Access image url");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?imageUrl={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();