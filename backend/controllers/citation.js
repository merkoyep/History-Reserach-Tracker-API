const moment = require('moment');
module.exports = function (app, prisma, authenticateToken) {
  app.get('/citations', authenticateToken, async (req, res) => {
    const citations = await prisma.citation.findMany();
    res.json({ citations: citations });
  });
  app.get('/citations/new', authenticateToken, async (req, res) => {
    const sources = await prisma.source.findMany();
    res.json({ sources: sources });
  });
  app.get('/citation/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      //query citation based on id
      const citation = await prisma.citation.findUnique({
        where: { id: parseInt(id, 10) },
      });
      //Also getting source belonging to citation
      const source = await prisma.source.findUnique({
        where: { id: parseInt(citation.sourceId, 10) },
      });
      if (citation) {
        // Pass citation and source into citations-show
        res.json({ citation: citation, source: source });
      } else {
        res.status(404).send('Citation not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  app.get('/citations/:id/edit', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      //query both citation and sources
      const citation = await prisma.citation.findUnique({
        where: { id: parseInt(id, 10) },
      });
      const sources = await prisma.source.findMany();
      if (citation) {
        res.json({ citation: citation, sources: sources });
      } else {
        res.status(404).send('Citation not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  app.post('/citations/new', authenticateToken, async (req, res) => {
    const { title, sourceId, location, notes } = req.body;

    try {
      const result = await prisma.citation.create({
        data: {
          title,
          sourceId: parseInt(sourceId, 10),
          location,
          notes,
        },
      });
      res.redirect('/citations');
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  app.put('/citations/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, sourceId, location, notes } = req.body;
    try {
      const updatedCitation = await prisma.citation.update({
        where: { id: parseInt(id, 10) },
        data: {
          title,
          sourceId: parseInt(sourceId, 10),
          location,
          notes,
        },
      });
      console.log('Citation updated successfully');
      res.json({
        message: 'Citation updated successfully',
        source: updatedCitation,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  app.delete('/citations/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.citation.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
