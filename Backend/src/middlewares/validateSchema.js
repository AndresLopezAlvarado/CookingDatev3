export const validateSchema = (schema) => (req, res, next) => {
    try {
      schema.parse(req.body);
      
      next();
    } catch (error) {
      console.error({
        message: "Something went wrong on validate schema (validateSchema)",
        error: error,
      });
  
      res.status(400).json({
        message: "Something went wrong on validate schema (validateSchema)",
        error: error,
      });
    }
  };
  