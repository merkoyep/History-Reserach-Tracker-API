const moment = require('moment');
module.exports = function (app, prisma) {
  app.get('/source/new', async (req, res) => {
    res.render('source-new', {});
  });
  app.get('/source', async (req, res) => {
    const sources = await prisma.source.findMany();
    const formattedSources = sources.map((source) => {
      return {
        ...source,
        publishDate: moment(source.publishDate).format('YYYY-MM-DD'),
      };
    });
    res.render('source-index', { sources: formattedSources });
  });
  app.get('/source/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const source = await prisma.source.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (source) {
        source.publishDate = moment(source.publishDate).format('YYYY-MM-DD');
        res.render('source-show', { source: source });
      } else {
        res.status(404).send('Source not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  app.get('/source/:id/edit', async (req, res) => {
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

  app.post('/source/new', async (req, res) => {
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
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  app.put('/source/:id', async (req, res) => {
    const { id } = req.params;
    const {
      title,
      authorFirstName,
      authorLastName,
      publishDate,
      publishedBy,
      edition,
      volume,
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
        },
      });
      res.redirect(`/source/${id}`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  app.delete('/source/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.source.delete({
        where: { id: parseInt(id, 10) },
      });
      res.redirect('/source');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
