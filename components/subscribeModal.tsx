'use client';

import Modal from "./Modal";

const SubscribeModal = () => {
    return (
        <Modal
            title="Only for premium users"
            description="Enjoy movies with BingeIt Premium!"
            isOpen
            onChange={() => { }}
        >
            Subscription
        </Modal>
    );
}

export default SubscribeModal;