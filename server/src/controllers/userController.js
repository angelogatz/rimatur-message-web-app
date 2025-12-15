import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "Usuário já existe com este e-mail." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao fazer login." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const myId = req.userId;

    const users = await prisma.user.findMany({
      where: {
        NOT: { id: myId },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const usersWithUnreadCount = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await prisma.message.count({
          where: {
            senderId: user.id,
            receiverId: myId,
            read: false,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          unreadCount: unreadCount,
        };
      })
    );

    return res.json(usersWithUnreadCount);
  } catch (error) {
    console.error("Erro na busca de usuários com contagem:", error);
    return res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};
