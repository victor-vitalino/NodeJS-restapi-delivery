import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        // chave de identificação do job
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { deliveryman, recipient, delivery } = data;
        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: `Entrega Cancelada`,
            template: 'cancellation',
            context: {
                deliveryman: deliveryman.name,
                client: recipient.name,
                delivery: delivery.id,
                product: delivery.product,
                street: recipient.street,
                number: recipient.number,
                neighborhood: recipient.neighborhood,
                city: recipient.city,
            },
        });
    }
}

export default new CancellationMail();
