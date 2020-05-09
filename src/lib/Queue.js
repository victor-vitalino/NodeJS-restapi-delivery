import Bee from 'bee-queue';

// jobs
import CancellationMail from '../app/jobs/CancellationMail';
import NewDeliveryMail from '../app/jobs/NewDeliveryMail';

import redisConfig from '../config/redis';

// lista de jobs
const jobs = [CancellationMail, NewDeliveryMail];

class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }

    // inicializando fila
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    // adicionando um job e salvando no redis
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    // processando filas
    processQueue() {
        jobs.forEach((job) => {
            const { bee, handle } = this.queues[job.key];
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, error) {
        console.log(`Queue ${job.queue.name}: Failed `, error);
    }

    /*
    imprime() {
        return this.queues;
    }
    */
}
export default new Queue();
