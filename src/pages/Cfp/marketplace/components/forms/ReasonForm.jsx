import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export const ReasonForm = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Le titre est requis';
        }

        if (!description.trim()) {
            newErrors.description = 'La description est requise';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onSubmit(title.trim(), description.trim());
            setTitle('');
            setDescription('');
            setErrors({});
            onClose();
        } catch (err) {
            setErrors({ title: 'Erreur lors de l\'ajout de la raison' });
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une raison de nous choisir">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    placeholder="Ex: Service client exceptionnel"
                    autoFocus
                />
                <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={errors.description}
                    placeholder="Décrivez pourquoi c'est un avantage..."
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