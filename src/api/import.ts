// API routes for import job management
import { NextApiRequest, NextApiResponse } from 'next';
import { ImportService } from '../../lib/import-service';
import { StorageService, createStorageService } from '../../lib/storage';
import { OrganizationService, ORGANIZATION_STRATEGIES } from '../../lib/organization';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetImportJobs(req, res);
    case 'POST':
      return handleStartImport(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}

/**
 * Get all import jobs
 */
async function handleGetImportJobs(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storageService = createStorageService();
    const organizationService = new OrganizationService(ORGANIZATION_STRATEGIES.date_based);
    const importService = new ImportService(storageService, organizationService);

    const jobs = await importService.getAllImportJobs();
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching import jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch import jobs' });
  }
}

/**
 * Start new import job
 */
async function handleStartImport(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      sourcePath,
      mode,
      organizationStrategy,
      deduplicate,
      generateThumbnails,
      preserveOriginals,
      tags,
      category,
      slug,
    } = req.body;

    if (!sourcePath || !mode) {
      return res.status(400).json({ error: 'Source path and mode are required' });
    }

    // Validate mode
    if (!['SCAN_ONLY', 'INGEST_MOVE', 'INGEST_COPY'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid import mode' });
    }

    // Get organization strategy
    const strategy = ORGANIZATION_STRATEGIES[organizationStrategy as keyof typeof ORGANIZATION_STRATEGIES] || ORGANIZATION_STRATEGIES.date_based;

    const config = {
      sourcePath,
      mode,
      organizationStrategy,
      deduplicate: deduplicate ?? true,
      generateThumbnails: generateThumbnails ?? true,
      preserveOriginals: preserveOriginals ?? true,
      tags,
      category,
      slug,
    };

    const storageService = createStorageService();
    const organizationService = new OrganizationService(strategy);
    const importService = new ImportService(storageService, organizationService);

    const jobId = await importService.startImportJob(config);

    return res.status(201).json({ 
      message: 'Import job started successfully',
      jobId,
    });
  } catch (error) {
    console.error('Error starting import job:', error);
    return res.status(500).json({ error: 'Failed to start import job' });
  }
}

/**
 * Get import job status
 */
export async function getImportJobStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const storageService = createStorageService();
    const organizationService = new OrganizationService(ORGANIZATION_STRATEGIES.date_based);
    const importService = new ImportService(storageService, organizationService);

    const job = await importService.getImportJobStatus(id);

    if (!job) {
      return res.status(404).json({ error: 'Import job not found' });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error('Error fetching import job status:', error);
    return res.status(500).json({ error: 'Failed to fetch import job status' });
  }
}

/**
 * Cancel import job
 */
export async function cancelImportJob(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const storageService = createStorageService();
    const organizationService = new OrganizationService(ORGANIZATION_STRATEGIES.date_based);
    const importService = new ImportService(storageService, organizationService);

    await importService.cancelImportJob(id);

    return res.status(200).json({ message: 'Import job cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling import job:', error);
    return res.status(500).json({ error: 'Failed to cancel import job' });
  }
}

