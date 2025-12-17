import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhiteboardSnapshot } from './entities/whiteboard-snapshot.entity';
import { Whiteboard } from '../whiteboards/entities/whiteboard.entity';

@Injectable()
export class WhiteboardSnapshotsService {
  constructor(
    @InjectRepository(WhiteboardSnapshot)
    private readonly snapshotRepository: Repository<WhiteboardSnapshot>,
  ) {}

  /**
   * Create a new snapshot for a whiteboard
   * @param whiteboard - Whiteboard entity
   * @param data - Snapshot data (shapes, drawings, etc.)
   * @returns Created snapshot entity
   */
  async createSnapshot(
    whiteboard: Whiteboard,
    data: Record<string, unknown>,
  ): Promise<WhiteboardSnapshot> {
    const snapshot = this.snapshotRepository.create({
      whiteboard,
      data,
    });

    return await this.snapshotRepository.save(snapshot);
  }

  /**
   * Update an existing snapshot
   * @param snapshotId - Snapshot ID
   * @param whiteboardId - Whiteboard ID to verify ownership
   * @param data - Updated snapshot data
   * @returns Updated snapshot entity
   */
  async updateSnapshot(
    snapshotId: string,
    whiteboardId: string,
    data: Record<string, unknown>,
  ): Promise<WhiteboardSnapshot> {
    const snapshot = await this.snapshotRepository.findOne({
      where: { 
        id: snapshotId,
        whiteboard: { id: whiteboardId },
      },
      relations: ['whiteboard'],
    });

    if (!snapshot) {
      throw new NotFoundException(
        'Snapshot not found or does not belong to this whiteboard',
      );
    }

    snapshot.data = data;
    return await this.snapshotRepository.save(snapshot);
  }

  /**
   * Save or update snapshot for a whiteboard
   * If snapshotId is provided and not empty, update existing snapshot
   * Otherwise, create a new snapshot
   * @param whiteboard - Whiteboard entity
   * @param data - Snapshot data
   * @param snapshotId - Optional snapshot ID to update
   * @returns Saved snapshot entity
   */
  async saveOrUpdateSnapshot(
    whiteboard: Whiteboard,
    data: Record<string, unknown>,
    snapshotId?: string,
  ): Promise<WhiteboardSnapshot> {
    // Only update if snapshotId is provided and not empty
    if (snapshotId && snapshotId.trim().length > 0) {
      // Update existing snapshot - verify it belongs to this whiteboard
      return await this.updateSnapshot(snapshotId.trim(), whiteboard.id, data);
    }

    // Create new snapshot
    return await this.createSnapshot(whiteboard, data);
  }

  /**
   * Get all snapshots for a whiteboard
   * @param whiteboardId - Whiteboard ID
   * @returns Array of snapshot entities
   */
  async findByWhiteboardId(
    whiteboardId: string,
  ): Promise<WhiteboardSnapshot[]> {
    return await this.snapshotRepository.find({
      where: { whiteboard: { id: whiteboardId } },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get latest snapshot for a whiteboard
   * @param whiteboardId - Whiteboard ID
   * @returns Latest snapshot entity or null
   */
  async findLatestByWhiteboardId(
    whiteboardId: string,
  ): Promise<WhiteboardSnapshot | null> {
    return await this.snapshotRepository.findOne({
      where: { whiteboard: { id: whiteboardId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Save or update snapshot for a whiteboard
   * If whiteboard has no snapshots, create a new one
   * If whiteboard has snapshots, update the latest one (data and updated_at)
   * @param whiteboard - Whiteboard entity
   * @param data - Snapshot data (shapes, drawings, etc.)
   * @returns Saved or updated snapshot entity
   */
  async saveOrUpdateSnapshotForWhiteboard(
    whiteboard: Whiteboard,
    data: Record<string, unknown>,
  ): Promise<WhiteboardSnapshot> {
    // Check if whiteboard has any snapshots by getting the latest one
    const latestSnapshot = await this.findLatestByWhiteboardId(whiteboard.id);

    if (!latestSnapshot) {
      // No snapshots exist, create a new one
      return await this.createSnapshot(whiteboard, data);
    } else {
      // Snapshots exist, update the latest one
      latestSnapshot.data = data;
      return await this.snapshotRepository.save(latestSnapshot);
    }
  }
}

