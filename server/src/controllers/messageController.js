import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const senderId = req.userId; 

    if (!content || !receiverId) {
      return res.status(400).json({ error: 'Conteúdo e destinatário são obrigatórios.' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    return res.status(201).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
};

export const getMessagesWithUser = async (req, res) => {
  try {
    const myId = req.userId; 
    const { otherUserId } = req.params; 

    if (!otherUserId) {
      return res.status(400).json({ error: 'ID do outro usuário é necessário.' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId },
        ],
      },
      orderBy: {
        createdAt: 'asc', 
      },
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    return res.json(messages);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
};

export const markAsRead = async (req, res) => {
    try {
        const myId = req.userId;
        const { otherUserId } = req.params;

        const result = await prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: myId,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return res.json({ message: 'Mensagens marcadas como lidas.', count: result.count });

    } catch (error) {
        console.error("Erro ao marcar mensagens como lidas:", error);
        return res.status(500).json({ error: 'Erro ao marcar como lidas.' });
    }
};