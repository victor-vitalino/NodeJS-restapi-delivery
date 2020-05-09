import Mail from '../../lib/Mail';

class NewDeliveryMail {
    get key() {
        return 'NewDeliveryMail';
    }

    async handle({ data }) {
        const { delivery, deliveryman, recipient } = data;
        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: `Nova entrega adicionada`,
            template: 'newDelivery',
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
export default new NewDeliveryMail();
