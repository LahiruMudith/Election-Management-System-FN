import jsPDF from "jspdf";
import "jspdf-autotable";
import {Voter} from "@/hooks/getAllVoters"; // Registers autoTable to jsPDF

export function exportVotersToPDF(voters: Voter[]) {
    const doc = new jsPDF();

    doc.text("Voters List", 14, 16);

    const tableColumn = [
        "ID", "Full Name", "NIC Number", "Phone Number", "District", "Active", "Verified", "Created At"
    ];
    const tableRows = voters.map(voter => [
        voter.id,
        voter.fullName,
        voter.nicNumber,
        voter.phoneNumber,
        voter.district,
        voter.isActive ? "Yes" : "No",
        voter.verified,
        voter.createdAt ? new Date(voter.createdAt).toLocaleString() : ""
    ]);

    // @ts-ignore
    doc.autoTable({
        startY: 22,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        styles: { fontSize: 10 },
    });

    doc.save("voters.pdf");
}