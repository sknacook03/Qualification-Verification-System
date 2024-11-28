import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createAgency = async (agency) => {
    try {
        const hash = await bcrypt.hash(agency.password, 10);
        
        return await prisma.agency.create({
            data: {
                email: agency.email,
                agency_name: agency.agency_name,
                telephone_number: agency.telephone_number || null, 
                address: agency.address || "-",                   
                subdistrict: agency.subdistrict || "-",           
                district: agency.district || "-",                 
                province: agency.province || "-",                 
                postal_code: agency.postal_code || "-",           
                type_id: agency.type_id,
                password: hash,
                certificate: agency.certificate || null,         
                status_approve: agency.status_approve || null,  
                approve_by: agency.approve_by || null             
            },
        });
    } catch (error) {
        console.error("Error creating agency:", error);
        throw error;
    }
};

export { createAgency };
