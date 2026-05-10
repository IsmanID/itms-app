-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('SERVER', 'SWITCH', 'FIREWALL', 'PC', 'LAPTOP', 'PRINTER', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'ON_CALL', 'GUARANTEE');

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "serial_number" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "log_number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "service_type" "ServiceType" NOT NULL,
    "problem_description" TEXT NOT NULL,
    "correction" TEXT NOT NULL,
    "hardware_replaced" JSONB,
    "engineer_signature" TEXT,
    "customer_signature" TEXT,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_logs" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "physical_checklist" JSONB NOT NULL,
    "cpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "nic" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "antivirus" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "performance_metrics" JSONB NOT NULL,
    "optimization_tasks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_logs" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "physical_check" JSONB NOT NULL,
    "interface_status" JSONB NOT NULL,
    "cpu_usage" TEXT NOT NULL,
    "ram_usage" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "firmware_version" TEXT NOT NULL,
    "security_services" JSONB,
    "ip_management" TEXT NOT NULL,
    "vlan_status" TEXT NOT NULL,
    "ping_results" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_tag_key" ON "assets"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_log_number_key" ON "incidents"("log_number");

-- CreateIndex
CREATE UNIQUE INDEX "server_logs_incident_id_key" ON "server_logs"("incident_id");

-- CreateIndex
CREATE UNIQUE INDEX "network_logs_incident_id_key" ON "network_logs"("incident_id");

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_logs" ADD CONSTRAINT "server_logs_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_logs" ADD CONSTRAINT "network_logs_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
