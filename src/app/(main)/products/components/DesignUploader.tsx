"use client";

import { useEffect, useRef, useState } from "react";
import { AiFillFile } from "react-icons/ai";
import { PAPER_RATIO } from "../configuration/previewSizes";
import { FaXmark } from "react-icons/fa6";

type Uploaded = {
	id: string;
	file: File;
	url: string;
	side: string;
};

type Props = {
	product: string | null;
	selectedSizes?: string | null;
	widthFt?: number | null;
	heightFt?: number | null;
	onFilesChange?: (files: Uploaded[]) => void;
};

function norm(product: string | null) {
	return product?.toLocaleLowerCase().trim() ?? "";
}

function getRatio(
	product: string | null,
	selectedSizes?: string | null,
	widthFt?: number | null,
	heightFt?: number | null,
): [number, number] {
	const p = norm(product);

	if (
		(p === "banner" || p === "banners" || p === "stickers & labels") &&
		widthFt &&
		heightFt
	) {
		return [widthFt, heightFt];
	}

	if (selectedSizes && PAPER_RATIO[selectedSizes]) {
		return PAPER_RATIO[selectedSizes];
	}

	if (p == "fliers") return [148, 210];
	if (p == "banners") return [3, 2];
	if (p == "stickers & labels") return [1, 1];
	if (p === "shirt printing") return [4, 5];
	if (p == "award") return [297, 210];
	if (p == "brochure") return [210, 297];
	return [85, 55];
}

function getSides(product: string | null): string[] {
	const p = norm(product);

	if (p === "card" || p === "fliers" || p === "brochure") {
		return ["front", "back"];
	}
	if (p == "shirt printing") return ["front", "back", "side"];
	return ["front"];
}

const DesignUploader = ({
	product,
	selectedSizes,
	widthFt,
	heightFt,
	onFilesChange,
}: Props) => {
	const [files, setFiles] = useState<Uploaded[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const objectUrlsRef = useRef(new Set<string>());
	const sides = getSides(product);
	const ratio = getRatio(product, selectedSizes, widthFt, heightFt);
	const activeFile = files.find((f) => f.id === activeId) || files[0];

	useEffect(
		() => () => {
			objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
		},
		[],
	);

	const handleFiles = (incoming: FileList) => {
		const updated: Uploaded[] = [...files];
		Array.from(incoming).forEach((file) => {
			const side =
				sides.find((candidate) =>
					updated.every((existing) => existing.side !== candidate),
				) ?? "extra";
			const url = URL.createObjectURL(file);
			objectUrlsRef.current.add(url);
			updated.push({
				id: Math.random().toString(36).slice(2),
				file,
				url,
				side,
			});
		});

		setFiles(updated);
		onFilesChange?.(updated);
		if (!activeId && updated[0]) setActiveId(updated[0].id);
	};

	const removeFile = (id: string) => {
		const removed = files.find((file) => file.id === id);
		if (removed) {
			URL.revokeObjectURL(removed.url);
			objectUrlsRef.current.delete(removed.url);
		}
		const updated = files.filter((f) => f.id !== id);
		setFiles(updated);
		onFilesChange?.(updated);
		if (activeId === id) setActiveId(updated[0]?.id || null);
	};
	return (
		<div className="mt-4">
			<h3 className="font-bold text-center text-[#0B3D2E] text-[15px]">
				Upload Design for {product ?? "product"}
			</h3>
			<p className="text-xs text-center text-gray-500 mb-2">
				{selectedSizes
					? `Size: ${selectedSizes}`
					: widthFt && heightFt
						? `Size: ${widthFt}ft x ${heightFt}`
						: "select size for correct preview"}
			</p>

			<p className="text-[10px] font-bold text-center">
				{activeFile ? `${activeFile.side.toUpperCase()} SIDE` : "FRONT SIDE"}
				<br />
				Preview
			</p>

			<div
				className={`w-full relative bg-gray-50 border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden`}
				style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
				onClick={() => inputRef.current?.click()}
			>
				{activeFile?.file.type.startsWith("image/") ? (
					<img
						src={activeFile.url}
						className="w-full h-full object-contain"
						alt={`${activeFile.side} design preview`}
					/>
				) : activeFile ? (
					<div className="text-center text-gray-600">
						<p className="text-4xl">
							<AiFillFile />
						</p>
						<p className="text-sm">{activeFile.file.name}</p>
					</div>
				) : (
					<div className="text-center">
						<p className="text-4xl">
							<AiFillFile />
						</p>
						<p>Choose files</p>
					</div>
				)}
			</div>

			{/** Thumbnails */}

			<div className="flex gap-2 mt-3 flex-wrap items-start">
				{files.map((f) => (
					<div
						key={f.id}
						onClick={() => setActiveId(f.id)}
						className={`relative w-20 border-2 rounded-lg overflow-hidden cursor-pointer bg-white ${f.id === activeId ? "border-green-800" : "border-gray-200"}`}
					>
						<span className="block text-[9px] font-bold text-center capitalize">
							{f.side}
						</span>
						{f.file.type.startsWith("image/") ? (
							<img
								src={f.url}
								alt={`${f.side} design`}
								className="w-full h-14 object-contain"
							/>
						) : (
							<div
								className="h-14 flex items-center justify-center"
								aria-label="PDF file"
							>
								<AiFillFile />
							</div>
						)}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeFile(f.id);
							}}
							className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1"
							aria-label={`Remove ${f.file.name}`}
						>
							<FaXmark />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="border px-3 py-1 text-xs rounded bg-white"
				>
					+ Add more +
				</button>
			</div>

			{/** File names */}
			<div className="text-[11px] mt-2 space-y-1">
				{files.map((f) => (
					<p key={f.id}>
						{f.side.toUpperCase()}:{f.file.name}
					</p>
				))}
			</div>

			<input
				ref={inputRef}
				type="file"
				accept="image/*, .pdf"
				multiple
				hidden
				onChange={(e) => {
					if (e.target.files) handleFiles(e.target.files);
					e.target.value = "";
				}}
			/>
		</div>
	);
};

export default DesignUploader;
