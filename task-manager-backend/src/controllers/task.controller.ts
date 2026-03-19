import { Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

// ✅ CREATE TASK
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.user!.userId;

    const task = await prisma.task.create({
      data: { title, userId },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// ✅ GET TASKS (pagination + filter + search)
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const { page = "1", limit = "5", status, search } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status && { completed: status === "true" }),
        ...(search && {
          title: { contains: search as string },
        }),
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// ✅ UPDATE TASK
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await prisma.task.updateMany({
      where: {
        id: Number(id),
        userId: req.user!.userId,
      },
      data: { title, completed },
    });

    res.json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// ✅ DELETE TASK
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.deleteMany({
      where: {
        id: Number(id),
        userId: req.user!.userId,
      },
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

// ✅ TOGGLE TASK
export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        userId: req.user!.userId,
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: { completed: !task.completed },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error toggling task" });
  }
};