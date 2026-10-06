import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Ajoutez cette fonction dans votre composant
const generatePDF = () => {
    const doc = new jsPDF();
    
    // En-tête du document
    doc.setFontSize(20);
    doc.setTextColor(75, 0, 130); // Violet
    doc.text('FICHE D\'ÉVALUATION', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Projet: ${idProject}`, 105, 30, { align: 'center' });
    doc.text(`Évaluateur: ${user?.name} ${user?.firstname}`, 105, 36, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 105, 42, { align: 'center' });
    
    // Score global
    doc.setFontSize(16);
    doc.setTextColor(75, 0, 130);
    doc.text('SCORE GLOBAL', 14, 60);
    
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(`${averageScore.toFixed(1)}/5`, 14, 70);
    
    // Critères d'évaluation
    doc.setFontSize(16);
    doc.setTextColor(75, 0, 130);
    doc.text('CRITÈRES D\'ÉVALUATION', 14, 90);
    
    const tableData = questionsWithNotes.map((criterion, index) => [
        index + 1,
        criterion.question,
        criterion.score.toString(),
        criterion.rating
    ]);
    
    doc.autoTable({
        startY: 95,
        head: [['#', 'Critère', 'Note', 'Appréciation']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [75, 0, 130],
            textColor: 255
        },
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 100 },
            2: { cellWidth: 20 },
            3: { cellWidth: 40 }
        }
    });
    
    // Commentaires
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(75, 0, 130);
    doc.text('COMMENTAIRES', 14, finalY);
    
    const comments = [
        { title: 'Points forts', content: evaluationData.one?.com1 || "Aucun commentaire" },
        { title: "Points d'amélioration", content: evaluationData.one?.com2 || "Aucun commentaire" },
        { title: 'Témoignage', content: evaluationData.one?.temoignage || "Aucun témoignage" }
    ];
    
    let currentY = finalY + 10;
    
    comments.forEach(comment => {
        doc.setFontSize(12);
        doc.setTextColor(75, 0, 130);
        doc.text(comment.title + ':', 14, currentY);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Gestion du texte multiligne
        const splitText = doc.splitTextToSize(comment.content, 180);
        doc.text(splitText, 20, currentY + 5);
        
        currentY += splitText.length * 5 + 10;
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 105, 280, { align: 'center' });
    
    // Sauvegarde du PDF
    doc.save(`evaluation-projet-${idProject}-${user?.name}-${user?.firstname}.pdf`);
};