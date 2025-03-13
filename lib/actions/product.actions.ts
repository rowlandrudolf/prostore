'use server';
// import { PrismaClient } from "@prisma/client";
import { toJson } from "../utils";
import { prisma } from "@/db/prisma";

export async function getLatestProducts(){
    const data = await prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc'}
    });
    // return JSON.parse(JSON.stringify(data))
    return toJson(data) ;
 }

export async function getProductBySlug(slug: string){
    return await prisma.product.findUnique({
        where: { slug } 
    })
}