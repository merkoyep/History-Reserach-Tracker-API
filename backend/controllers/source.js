const moment = require('moment');
module.exports = function (app, prisma, authenticateToken) {
  app.get('/source/new', async (req, res) => {
    res.render('source-new', {});
  });
  app.get('/source', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    const sources = await prisma.source.findMany({
      where: { userId: userId },
      include: {
        citations: true,
      },
    });
    const formattedSources = sources.map((source) => {
      return {
        ...source,
        publishDate: moment(source.publishDate).format('YYYY-MM-DD'),
      };
    });
    res.json({ sources: formattedSources });
  });
  app.get('/source/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const source = await prisma.source.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          citations: true, // Ensure this is correctly placed here
        },
      });
      if (source) {
        source.publishDate = moment(source.publishDate).format('YYYY-MM-DD');
        // Include citation date formatting if necessary
        const formattedCitations = source.citations.map((citation) => ({
          ...citation,
          date: citation.date
            ? moment(citation.date).format('YYYY-MM-DD')
            : null,
        }));
        // Send back the source with formatted citations
        res.json({ source: { ...source, citations: formattedCitations } });
      } else {
        res.status(404).send('Source not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  app.get('/source/:id/edit', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const source = await prisma.source.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (source) {
        source.publishDate = moment(source.publishDate).format('YYYY-MM-DD');
        res.render('source-edit', { source });
      } else {
        res.status(404).send('Source not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  app.post('/source/new', authenticateToken, async (req, res) => {
    const {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition,
      volume,
    } = req.body;
    const userId = res.locals.currentUser.id;

    if (!userId) {
      // Handle the case where the user is not logged in or the user ID is not available
      return res.status(403).send('User must be logged in to add a source.');
    }

    try {
      const result = await prisma.source.create({
        data: {
          title,
          authorFirstName,
          authorLastName,
          publishDate: new Date(publishDate + 'T00:00:00Z'),
          publishedBy,
          edition: edition ? parseInt(edition) : null,
          volume: volume ? parseInt(volume) : null,
          userId,
        },
      });
      console.log('Source added successfully!');
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  app.put('/source/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition,
      volume,
      url,
    } = req.body;
    try {
      const updatedSource = await prisma.source.update({
        where: { id: parseInt(id, 10) },
        data: {
          title,
          authorFirstName,
          authorLastName,
          publishDate: new Date(publishDate + 'T00:00:00Z'),
          publishedBy,
          edition: edition ? parseInt(edition) : null,
          volume: volume ? parseInt(volume) : null,
          url,
        },
      });
      console.log('Source updated successfully');
      res.json({
        message: 'Source updated successfully',
        source: updatedSource,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  app.delete('/source/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.source.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
