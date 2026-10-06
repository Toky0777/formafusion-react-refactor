import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const TraitForm = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
}) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            await onSubmit(title.trim());
            setTitle('');
            setError('');
            onClose();
        } catch (err) {
            setError('Erreur lors de l\'ajout du trait');
        }
    };

    const handleClose = () => {
        setTitle('');
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une caractéristique">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Titre de la caractéristique"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={error}
                    placeholder="Ex: Expérience de 10 ans"
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button type="submit" loading={loading}>
                        Ajouter
                    </Button>
                </div>
            </form>
        </Modal>
    );
};